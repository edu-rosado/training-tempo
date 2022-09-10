<script>
    import clickOutside from '$lib/actions/clickOutside'
    let isActive = false;
    export let menuStyles = ""
    export let menuClasses = ""
</script>

<div class="dropdown inline-block relative" class:active={isActive} use:clickOutside on:click_outside={()=> isActive = false}>
    <div class="inline-block" on:click={()=> isActive = !isActive}>
        <slot name="button" />
    </div>
    <div class={"dropdown-menu absolute hidden " + menuClasses} style={menuStyles}>
        <slot name="menu" />
    </div>
</div>

<style>
    .dropdown.active .dropdown-menu {
        display: block;
    }
</style>
