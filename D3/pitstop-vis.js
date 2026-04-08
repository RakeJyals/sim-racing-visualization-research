const load_data = function (i) {

    d3.csv(`${path_prefix}${i}${path_suffix}`, function (d) {
        return {
            pos : +d["position"],
            class : d["class"],
            rel_laps : +d["rel_laps"],
            lap_delta : +d["lap_delta"],
            gap : +d["gap"],
            laps_remaining : +d["laps_remaining_in_stint"]
        }
    }).then(function (data) {
        
    })

}