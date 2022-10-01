<script>
    import clickOutside from "$lib/actions/clickOutside";
    export let isActive = false;
    export let useClickOutside = true;
    export let menuStyles = "";
    export let menuClasses = "";
</script>

<div
    class="dropdown inline-block relative"
    class:active={isActive}
    use:clickOutside
    on:click_outside={() => (isActive = !useClickOutside)}
>
    <div class="inline-block" on:click={() => (isActive = !isActive)}>
        <slot name="button" />
    </div>
    <div class={"dropdown-menu absolute hidden w-full " + menuClasses} style={menuStyles}>
        <slot name="menu" />
    </div>
</div>

<style>
    .dropdown.active .dropdown-menu {
        display: block;
    }
</style>
