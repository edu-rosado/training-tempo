<script>
    import "../app.css";
</script>

<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Courgette" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</svelte:head>

<div class="h-10 bg-indigo-600 text-white flex items-center px-5">
    <h1>TrainingTempo</h1>
</div>

<div class="w-screen flex flex-col" style="height: calc(100vh - 2.5rem);">
    <slot />
</div>

<style>
    h1 {
        font-family: "Courgette", "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva,
            Verdana, sans-serif;
    }
</style>
