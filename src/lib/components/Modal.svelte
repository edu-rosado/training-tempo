<script>
    export let isOpen = true;

    function closeModal() {
        isOpen = false;
    }
</script>

<!--Modal-->
<div class="fixed w-full h-full top-0 left-0 flex items-center justify-center z-10" class:hidden={!isOpen}>
    <div class="absolute w-full h-full bg-gray-900/50 " on:click={closeModal} />

    <div class="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-10 overflow-y-auto">
        <div class="modal-content py-4 text-left px-6">
            <div class="flex justify-between items-center pb-3">
                <slot name="title"><p class="text-2xl font-bold">Title</p></slot>
                <div class="cursor-pointer z-10" on:click={closeModal}>
                    <svg
                        class="fill-current text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                    >
                        <path
                            d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                        />
                    </svg>
                </div>
            </div>

            <!--Body-->
            <slot name="body" />

            <!--Footer-->
            <div class="flex justify-end pt-2">
                <slot name="footer">
                    <button
                        class="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
                        on:click={closeModal}>Close</button
                    >
                </slot>
            </div>
        </div>
    </div>
</div>
