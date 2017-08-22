// Dropdown Transitions
$('.dropdown').dropdown({
    transition: 'fade down'
});

$("#logout").on("click", () => {

        $.get("/logout", () => {
            return;
        })
    }


)