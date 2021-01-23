var testCreateExisting_AT = document.getElementById("testCreateExisting_AT");
var testDeleteNonExistant_AT = document.getElementById("testDeleteNonExistant_AT");
var testDeleteWhenTwoExist_AT = document.getElementById("testDeleteWhenTwoExist_AT");
var testDeleteAfterCreateTag_AT = document.getElementById("testDeleteAfterCreateTag_AT");

testCreateExisting_AT.addEventListener("click", function () {
    console.log("##### BEGINNING TEST create an existing tag AIRTABLE #####");
    Airtable.createTag("existingTag", "ang", function () {
        try {
            Airtable.createTag("existingTag", "ang", function () {
                let tagsInfo = Airtable.getTagsInfo();
                console.log("tagsInfo: ", tagsInfo);
            })   
        }
        catch (e) {
            console.log("Deleting Tag")
            Airtable.deleteTag("existingTag");
        }
    })
    console.log("##### ENDING TEST create an existing tag AIRTABLE #####");
})
