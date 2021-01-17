/* test getTagsInfo */
var getTagsInfo = document.getElementById("getTagsInfo");
getTagsInfo.addEventListener("click", async function () {
    var tagsInfo = await mySL.getTagsInfo();
    console.log(tagsInfo);
})

/* test createNewTag */
var createNewTag = document.getElementById("createNewTag");
createNewTag.addEventListener("click", async function () {
    mySL.createTag("newTag", 4, async function () {
        var tagsInfo = await mySL.getTagsInfo();
        console.log(tagsInfo);
    });
})