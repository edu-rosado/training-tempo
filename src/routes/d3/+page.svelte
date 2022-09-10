<script>
    import { select, arc } from "d3";
    import { onMount } from "svelte";

    onMount(() => {
        const svg = select("svg");
        const svg_node = svg.node();
        const width = +svg_node.clientWidth;
        const height = +svg_node.clientHeight;

        const mainG = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

        mainG.append("circle").attr("r", 100).attr("fill", "orange");

        const eyesYOffset = -40;
        const eyesSpacing = 50;
        const eyesR = 50;

        const eyesG = mainG.append("g").attr("transform", `translate(0,${eyesYOffset})`);
        eyesG.append("circle").attr("r", eyesR).attr("cx", -eyesSpacing).attr("fill", "#0ea9b5");
        eyesG.append("circle").attr("r", 5).attr("cx", -eyesSpacing);
        eyesG.append("circle").attr("r", eyesR).attr("cx", eyesSpacing).attr("fill", "#0ea9b5");
        eyesG.append("circle").attr("r", 5).attr("cx", eyesSpacing);

        const eyeBrowWidth = 20;
        const eyebrowG = eyesG.append("g");
        eyebrowG
            .transition()
            .duration(500)
            .attr("transform", "translate(0,-30)")
            .transition()
            .duration(1000)
            .attr("transform", "translate(0,0)");
        eyebrowG
            .append("rect")
            .attr("width", eyeBrowWidth)
            .attr("height", 5)
            .attr("x", -eyesSpacing - eyeBrowWidth / 2)
            .attr("y", -20);
        eyebrowG
            .append("rect")
            .attr("width", eyeBrowWidth)
            .attr("height", 5)
            .attr("x", eyesSpacing - eyeBrowWidth / 2)
            .attr("y", -20);

        // Mouth
        mainG
            .append("g")
            .attr("transform", "translate(0,15)")
            .attr("fill", "#eb5d02")
            .append("path")
            .attr(
                "d",
                arc()({
                    innerRadius: 0,
                    outerRadius: 60,
                    startAngle: Math.PI / 2,
                    endAngle: Math.PI * 1.5,
                })
            )
            .transition()
            .duration(500)
            .attr("transform", "scale(1.5)")
            .transition()
            .duration(1000)
            .attr("transform", "scale(1)");
    });
</script>

<div class="w-screen h-screen flex justify-center items-center">
    <svg class="w-4/5 h-4/5 bg-slate-100 border border-gray-400" />
</div>
