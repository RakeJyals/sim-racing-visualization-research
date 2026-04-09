// TODO support for gap/delta overflow and underflow
const load_data = function (i) {

    d3.csv(`${path_prefix}${i}${path_suffix}`, function (d) {
        if (d["rel_laps"] == "0" && d["gap"] == "0") {
            jitter = jitter_height * 1.1 + 10
            is_self = true
        }
        else {
            jitter = Math.random() * jitter_height + 10 // May need to be transformed,
            is_self = false
            // Math.random() is uniform [0,1]
        }
        return {
            //pos : +d["position"],
            class : d["class"],
            rel_laps : +d["rel_laps"],
            lap_delta : +d["lap_delta"],
            gap : +d["gap"],
            laps_remaining : +d["laps_remaining_in_stint"],
            jitter : jitter,
            is_self : is_self
        }
    }).then(function (data) {
        

        const svgElement = d3.select("#chart")
        const svg = svgElement
            .select("svg")
            //.append("g")
            //.attr("transform", "translate()")

        const parentE = svgElement.node()
        const width = parentE.clientWidth
        const height = parentE.clientHeight

        const gap_extent = Math.max(...d3.extent(data, d => d.gap).map(Math.abs)) + d3.max(data, d => d.gap)
        const gap_scale = d3.scaleLinear()  // lap_delta also uses this scale
            .domain([-80, 80])  // Temporary!
            .range([0, width])

        const class_scale = d3.scaleOrdinal()
            .domain(["HY", "GT3"])
            .range(["circle", "rect"])

        // TODO rel_laps, laps_remaining (reconcile 2 color axes! May need to group, or use opacity?)
        const hue_scale = d3.scaleDiverging()
            .domain([-1, 0, 1])  // Hopefully this will clip?
            .range(["blue", "green", "red"])

        const opacity_scale = d3.scaleLinear()
            .domain([0, 29])
            .range([0.1, 1])  // Minimum should be smallest opacity that people can consistently see

        const size_scale = d3.scaleOrdinal()  // For emphasizing important marks
            .domain([true, false])
            .range([1.5 * mark_radius, mark_radius])

        // Axis
        svg.select("#axis")
            .attr("transform", `translate(0, ${jitter_height * 1.1 + 10})`)
            .call(d3.axisBottom(gap_scale))


        // Tails
        svg.select("#tails")
            .selectAll("line")
            .data(data)
            .join("line")
                .style("stroke", d => hue_scale(d.rel_laps))
                .style("stroke-width", line_width)
                .style("opacity", d => opacity_scale(d.laps_remaining))
                .attr("x1", d => gap_scale(d.gap))
                .attr("y1", d => d.jitter)
                .attr("x2", d => gap_scale(d.gap + d.lap_delta))
                .attr("y2", d => d.jitter)  // Keep in mind that circ pos is measured by center, rect by top-left corner
                // (apply translation, subtract half of width, add half height)

        // Marks
        const class_groups = d3.group(data, d => d.class)
        class_groups.forEach(function (value, key, map) {
            svg.select(`#${key}`)
                //.attr("id", key)
                .selectAll(".mark")
                .data(value)
                .join(class_scale(key))
                    // Shared attributes
                    .attr("class", "mark")
                    .style("fill", d => hue_scale(d.rel_laps))
                    .style("opacity", d => opacity_scale(d.laps_remaining))
                    // circle attributes
                    .attr("cx", d => gap_scale(d.gap))
                    .attr("cy", d => d.jitter)
                    .attr("r", d => size_scale(d.is_self))
                    // rect attributes
                    .attr("x", d => gap_scale(d.gap) - size_scale(d.is_self))
                    .attr("y", d => d.jitter - size_scale(d.is_self))
                    .attr("width", d => 2 * size_scale(d.is_self))  // Needs to be larger!
                    .attr("height", d => 2 * size_scale(d.is_self))
        })

        // Pitstop Rect
        svg.select("#pitstop-rect")
            .select("rect")
                .attr("x", gap_scale(-pitstop_length))
                .attr("y", 0)
                .attr("width", gap_scale(0) - gap_scale(-pitstop_length))
                .attr("height", jitter_height + 10)
                .style("fill", "yellow")
                .style("fill-opacity", 0.25)


    })

}