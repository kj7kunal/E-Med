//---- Dropdown Animation Semantic UI ----//
$('.dropdown').dropdown({
    transition: 'fade down'
});


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

  $(document).on("click", ".minus.icon", deleteSpecialist);