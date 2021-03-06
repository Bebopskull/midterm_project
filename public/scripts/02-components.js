  //patchObj is {id,title,url,user_id,description,category_id,media_type_id,created_at, avg_rating}

  const replaceThumbnail = function(category) {
    let imgSrc = '';
    switch (category) {
      case 'Software Development':
        imgSrc = "./media/software.png";
        break;
      case 'Food':
        imgSrc = "./media/food.png";
        break;
      case 'Art':
        imgSrc = "./media/art.png";
        break;
      case 'Languages':
        imgSrc = "./media/languages.png";
        break;
      case 'Personal Development':
        imgSrc = "./media/personal.png";
        break;
      case 'Travel':
        imgSrc = "./media/travel.png";
        break;
      default:
        imgSrc = "./media/thumbnail_demo.png";
        break;
    }
    return imgSrc;
  };

///build the comments html structure
const createCommentElement = function(comment) {
  let $comment = /* Your code for creating the tweet element */
  // ...
        $(
          `<br>
          <article class="comment">
            <header class="commentHead">
              <div class='authorPresentation'>
                <p class="commentAuthorName"> ${comment.name} </p>
              </div>

            </header>
            <div class="commentContent">
              <p id='commentFrom${comment.name}'>${escapa(comment.comment)}</p>
            </div>
            <footer class='tweetFooter'>
              <p class='date'>${Date(comment.created_at)}</p>
            </footer>

          </article>`
        )


  return $comment;
}

  //Takes in a patch obj and returns html
  const createPatchElement = function(patchObj) {

    //takes in a string and returns the xml-safe version
    const escape =  function(str) {
      let div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    ///added this line, so the average ratings are limited to 1 decimal.
    let ave_rating = Math.round(patchObj.ave_rating * 10 )/10;


    //       THE HTML OF A SINGLE PATCH
    const patchEl =
    `<div class= "frame" id = 'frame_${patchObj.id}' data-category="${patchObj.category}">
         <div class = 'patch' id='patch_${patchObj.id}''>
            <div class='infoHeader' id='patchHeader_${patchObj.id}'>
              <a class='sourceUrl' href='${patchObj.url}'><b>${patchObj.title}</b></a>
              <p class = 'usertag'>${patchObj.name}</p>
            </div>
            <div class = 'thumbnail'>
                   <img class = 'thumbnailContent' src="${replaceThumbnail(patchObj.category)}">
            </div>
            <div class = 'patchinfo'>
              <div class='patchinfoLeft'>
                <p>created on: ${patchObj.created_at.substring(0,10)}</p>
              </div>
              <div class='patchinfoRight'>
                <p class="ave-rating">${ave_rating}</p>
                <p class = 'saveflag' data-patchid = "${patchObj.id}" >
                  <i class="far fa-bookmark"></i>
                </p>
              </div>
            </div>
          </div>

          <div class='addendum' id = 'addend_${patchObj.id}'>
            <div class = 'addendumhead'>
              <p class='closingBtn'>X</p>
            </div>
            <div class='description' id = 'descr_${patchObj.id}'>
              <p>${patchObj.description}</p>
              <a class='sourceUrl' href='${patchObj.url}'>${patchObj.url}</a>
            </div>

            <div class='new_comment'>

              <form method = "POST" action = "/reviews" data-patchid=${patchObj.id} class="patchcomment">
                <textarea name="comment" class="comment-text" placeholder="What do you think about this Patch?" name="comment"></textarea>
                <br>
                <footer class ='bajoTextInput comment-footer' id='bajoTextInput'>
                  <button class='commentBtn' type="submit">Post</button>
                  <div class='rateSection'>

                  <!-- star rating -->
                  <div class="star-rating">
                  <s data-star="1" class="inactive">
                    <s data-star="2" class="inactive">
                      <s data-star="3" class="inactive" >
                         <s data-star="4" class="inactive">
                            <s data-star="5" class="inactive">
                            <span class="innermost"></span>
                  </s></s></s></s></s>
                  </div>

                    <input type="hidden" class='rateInput' name="rating" value="0">
                    <input type="hidden" name="userId" value="0" class="user-id">
                    <input type="hidden" name ="patchId" value="${patchObj.id}">
                  </div>

                </footer>
              </form>

            </div>
            <br>
            <div class = 'comments' >
              <button class='newCommentBtn' >Comment&nbsp<i class="fas fa-sort"></i></button>
              <br>
              <div class='commentsContainer'>

              </div>
            </div>

          </div>
        </div>`;

  return patchEl;
  }





  // <form method="POST" action="/collection">
  // <input type="hidden" name="patch_id" value="${patchObj.id}"><button type="submit">
  // <i class="far fa-bookmark"></i></button></form> </p>

  //takes in an array of patch objects and renders html into the <section>
  // element in the document
const renderPatches = function(patchesArr) {

  const patchColors = [];

  let render = '';
  if (patchesArr.length === 0) {
    render = 'no patches here yet'
  }
  for (patchObj of patchesArr) {
    $patch = createPatchElement(patchObj);
    render = $patch + render;
  }
    $('section.board').append(render);


};


//optionally takes in a user obj and renders either the "logged in user" HTML to the navbar or the default login form.
const loginOrLogout = function (user = null) {
  let outputHTML = ''
  if (!user) {
    outputHTML = `<form class="form-inline" action="/login" method="POST" id="login_form">
    <input type="text" name="email" placeholder='email'>
    <button type="submit" class="btn nav-btn">Log In</a>
  </form>`
  } else {
    outputHTML = `
    <div class= nav-item>
     <div class="username"><span>Hi <b>${user.name}&nbsp</b></span></div>
        <div class="dropdown">
          <button class="dropbtn"><i class="fas fa-user"></i></button>
          <ul class="dropdown-content user-links">
          <li><form class="form-inline" action="/patches/:userid" method="GET" id="getPatches">
          <button type="submit" class="btn nav-btn regular">My Patches</button>
          </form></li>
          <li><form class="form-inline" action="/patches/:collectionid" method="GET" id="getSaved">
          <button type="submit" class="btn nav-btn regular">Saved Patches</button>
          </form></li>
          <li><form class="form-inline" id="updateProfile">
          <button type="submit" class="btn nav-btn regular">Update Profile</button>
          </form></li>
          <li><form class="form-inline" action="/logout" method="POST" id="logout_form">
            <button type="submit" class="btn nav-btn">Logout</button>
            </form></li>
          </ul>
        </div>
      </div>
    </div>
    `
  }

  $(".login div").html(outputHTML)
}

//optionally takes in a user and renders "signup" or "addpatch" in the nav depending on whether a user is signed in
const signupOrAddPatch = function (user = null) {
  let outputHTML = ''
  if (!user) {
    outputHTML = `<p>New Quilter? <a id="signup">Sign up!</a>`
  } else {
    outputHTML = `
    <p><a id="add-patch">Add Patch</a>
    `
  }
  $("#user-option").html(outputHTML)
}

//optionally takes in a user obj (with .name property) and renders the navbar depending on whether the user is logged in.
const navState = function (user = null) {
  loginOrLogout(user);
  signupOrAddPatch(user);
}
//variable to store the html of ADDPATCH form


const CollectionHeader = function(name) {
  $("section.board").append(`
  <div class="coll-name">
  <b>${name}</b>
  </div>`)
}

//takes in an array of patch ids and matches to toggle saved state
const showSavedByUser = function (patchIds) {
  const allSaveFlags = $("section.board").find(".saveflag")
  allSaveFlags.each(function(){
    if ($.inArray(parseInt($(this).attr("data-patchid")), patchIds) >= 0) {
      const icon = $(this).find("i");
      icon.removeClass("far");
      icon.addClass("fas")
    }
  })

}
