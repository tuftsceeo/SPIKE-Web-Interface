var testGetTagsInfo = document.getElementById("testGetTagsInfo_AT");
var testSetTagValue = document.getElementById("testSetTagValue_AT");
var testSetTagValueNonString = document.getElementById("testSetTagValueNonString_AT")
var testGetTagValue = document.getElementById("testGetTagValue_AT");
var testCreateTag = document.getElementById("testCreateTag_AT");
var testDeleteTag = document.getElementById("testDeleteTag_AT");
var testIsActive = document.getElementById("testIsActive_AT");

testGetTagsInfo.addEventListener("click", function () {
    console.log("##### BEGINNING TEST getTagsInfo() AIRTABLE #####");
    let tagsInfo = Airtable.getTagsInfo();
    console.log("tagsInfo: ", tagsInfo);
    console.log("##### ENDING TEST getTagsInfo() AIRTABLE #####");
})

testSetTagValue.addEventListener("click", function () {
    console.log("##### BEGINNING TEST setTagValue() AIRTABLE #####");
    console.log("Setting the value of 'command' to 'testing string input' ")
    Airtable.setTagValue("command", "testing string input", function () {
        let tagsInfo = Airtable.getTagsInfo();
        console.log("tagsInfo: ", tagsInfo);
        console.log("##### ENDING TEST setTagValue() AIRTABLE #####");
    })
})

testSetTagValueNonString.addEventListener("click", function () {
    console.log("##### BEGINNING TEST setTagValue() of non string in AIRTABLE #####");
    console.log("Setting the value of 'command' to 123 ")
    Airtable.setTagValue("command", 123, function () {
        let tagsInfo = Airtable.getTagsInfo();
        console.log("tagsInfo: ", tagsInfo);
        console.log("##### ENDING TEST setTagValue() of non string in AIRTABLE #####");
    })
})

testGetTagValue.addEventListener("click", function () {
    console.log("##### BEGINNING TEST getTagValue() AIRTABLE #####");
    console.log("Getting value of 'command' tag ")
    let value = Airtable.getTagValue("command");

    console.log("value: ", value);

    console.log("##### ENDING TEST getTagValue() AIRTABLE #####");
})

testCreateTag.addEventListener("click", function () {
    console.log("##### BEGINNING TEST createTag() AIRTABLE #####");
    console.log("Creating tag called 'newTag' ")
    // create a tag called "newTag"
    Airtable.createTag("newTag", "new value", function () {
        let tagsInfo = Airtable.getTagsInfo();
        console.log("tagsInfo: ", tagsInfo);
        console.log("##### ENDING TEST createTag() AIRTABLE #####");
    })

})

testDeleteTag.addEventListener("click", function () {
    console.log("##### BEGINNING TEST deleteTag() AIRTABLE #####");
    console.log("Deleting tag called 'newTag' ")
    Airtable.deleteTag("newTag", function () {
        let tagsInfo = Airtable.getTagsInfo();
        console.log("tagsInfo:", tagsInfo);
        console.log("##### ENDING TEST deleteTag() AIRTABLE #####");
    })
})

testIsActive.addEventListener("click", function () {
    console.log("##### BEGINNING TEST isActive() AIRTABLE #####");

    console.log("##### ENDING TEST isActive() AIRTABLE #####");
})