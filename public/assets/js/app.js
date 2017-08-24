console.log("app.js loaded");
//---- Dropdown Animation Semantic UI ----//
$('.dropdown').dropdown({
    transition: 'fade down'
});

$("#logout").on("click", () => {

        $.get("/logout", () => {
            return;
        })
    }
)

//---- Delete Specialist ----//
function deleteSpecialist(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    console.log($(this).data("id"))
    $.ajax({
      method: "DELETE",
      url: "/specialists/delete/" + id
    }).done(function(result){
        console.log(result);
        window.location.href = result.url;
    });
  }

function checkClick (event) {
    console.log($(this).data("id"));
}

  $(document).on("click", ".minus.icon", deleteSpecialist);
  $(document).on("click", "input[type='checkbox']", checkClick);

