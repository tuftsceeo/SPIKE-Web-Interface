
// create "newTag" and delete it
var deleteTag = document.getElementById("deleteTag");
deleteTag.addEventListener("click", async function () {
    console.log("creating 'newTag' with value 4 ");

    // create 'newTag'
    mySL.createTag("newTag", 4, async function () {

        console.log("'newTag' was created");

        await sleep(1000);

        console.log(await mySL.getTagsInfo());
        //delete 'newTag'

        mySL.deleteTag("newTag", async function () {

            console.log("'newTag' has been deleted")
            console.log(await mySL.getTagsInfo());

        });
    });
});

// delete "newTag" once if it doesnt exist, twice if it does
var deleteTag1 = document.getElementById("deleteTag1");
deleteTag1.addEventListener("click", async function () {
    console.log("checking if 'newTag' exists");

    var tagsInfo = await mySL.getTagsInfo();
    var newTagExists = false;

    for (key in tagsInfo) {
        if (key == "newTag") {
            newTagExists = true;
        }
    }

    if (newTagExists) {

        console.log("newTag exists, deleting it twice")

        mySL.deleteTag("newTag", async function () {
            console.log("newTag deleted");

            await sleep(2000);

            tagsInfo = await mySL.getTagsInfo();

            console.log(tagsInfo);

            mySL.deleteTag("newTag", async function () {
                console.log("newTag deleted again");

                await sleep(2000);

                tagsInfo = await mySL.getTagsInfo();

                console.log(tagsInfo);
            })
        })
    } else {
        console.log("newTag doesn't exist, deleting it");
        mySL.deleteTag("newTag", async function () {
            console.log("newTag deleted");

            await sleep(2000);

            tagsInfo = await mySL.getTagsInfo();

            console.log(tagsInfo);
        })
    }
});


// just delete
var deleteTag2 = document.getElementById("deleteTag2");
deleteTag2.addEventListener("click", async function () {
    mySL.deleteTag("newTag", async function () {
        console.log("newTag deleted");

        await sleep(2000);

        tagsInfo = await mySL.getTagsInfo();

        console.log(tagsInfo);
    })
});