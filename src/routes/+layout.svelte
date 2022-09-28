<script>
    import { page } from "$app/stores";
    import "../app.css";

    /**
     * @param {string[]} pathList
     */
    function updatePrevUrl(pathList) {
        if (pathList.length == 2) {
            return "/";
        } else if (pathList[pathList.length - 2] === "sounds") {
            // Skip music-config/sounds
            return pathList.slice(0, pathList.length - 2).join("/");
        }
        return pathList.slice(0, pathList.length - 1).join("/");
    }

    $: pathList = $page.url.pathname.split("/");
    $: prevUrl = updatePrevUrl(pathList);

    let title = "TrainingTempo";
    $: if (pathList[1].length > 0) {
        //  MUSIC-CONFIG
        if (pathList[1] === "music-config") {
            if (pathList.length == 2) {
                title = "TrainingTempo - Sounds";
            } else if (pathList[2] === "sounds") {
                title = `Sounds`;
            }
        }
    } else {
        console.log(pathList);
        title = "TrainingTempo";
    }
</script>

<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Courgette" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</svelte:head>

<div class="h-screen flex flex-col">
    <div class="h-12 bg-indigo-600 text-white flex items-center justify-between px-5">
        {#if pathList[1].length > 0}
            <a href={prevUrl}><span class="material-icons mr-3">arrow_back_ios</span></a>
        {/if}
        <h1 class="flex-grow text-center" style="margin-top: 0.1rem;">{title}</h1>

        {#if $page.url.pathname !== "/music-config"}
            <a href="/music-config" class="flex"><span class="material-icons cursor-pointer">music_note</span></a>
        {/if}
    </div>

    <div class="flex flex-col flex-grow">
        <slot />
    </div>
</div>

<style>
    h1 {
        font-family: "Courgette", "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva,
            Verdana, sans-serif;
    }
</style>
