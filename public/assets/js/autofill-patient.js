$("#autofill").on("click", function(event) {
    event.preventDefault();
    $("input[name='firstName']").val("Test");
    $("input[name='lastName']").val("Test");
    $("input[name='dob']").val("11/15/1990");
    $("input[name='gender']").val("Female");
    $("input[name='streetAddress']").val("Test");
    $("input[name='city']").val("New York");
    $("input[name='zip']").val("11215");
    $("input[name='telephone']").val("212-555-1212");
    $('select[name=state]').val("NY");
    $("input[name='image']").val("https://semantic-ui.com/images/avatar2/large/rachel.png");
    $("input[name='providerName']").val("Test");
    $("input[name='height']").val("6'");
    $("input[name='weight']").val("182");
    $("input[name='allergies']").val("Allergy1, Allergy2");
    $("input[name='procedures']").val("Procedure1, Procedure2");
    $("input[name='emergencyContactName']").val("Emergency Test");
    $("input[name='emergencyContactNumber']").val("212-555-1212");
})