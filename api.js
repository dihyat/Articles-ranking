//Author : Md Mabrur Husan Dihyat
// This is the file where I connect to the api's to retrieve data and post them on the website

let ourRequest = new XMLHttpRequest();
let count = 0;

if (localStorage.getItem("varname") > 0) {
  count = localStorage.getItem("varname");
} else {
  count = 0;
}
//these are the names of the articles
let links = ["article-1", "article-2", "article-3", "article-4", "article-5"];

//this function connects to the api
function connection() {
  console.log(count);

  ourRequest.open(
    "GET",
    "https://6276e623-2b9c-46e3-873f-1d7ea606df45.mock.pstmn.io/" + links[count]
  );
}

connection();

let title = $("#title"); //stores the title of each article in this variable

ourRequest.onload = function() {
  let ourData = JSON.parse(ourRequest.responseText); //reads the json file
  let header = ourData.title;
  $(document).attr("title", header);
  $.each(ourData.body, function(i, data) {
    html(data);
  });

  //the if statement is used to add the button. The buttons will say next article except on the last page
  //where it will say vote.
  if (count == 4) {
    $("div")
      .add("<button id='btn'>Vote</button>")
      .appendTo(document.getElementById("one"));
  } else {
    $("div")
      .add("<button id='btn'>Next Article</button>")
      .appendTo(document.getElementById("one"));
  }
  $("#btn").click(function() {
    button();

    connection();
  });
};

//this function is used to load the next articles. Every time the button is clicked, the counter is incremented
//by one and the next article is loaded
function button() {
  count++;
  if (count > 4) {
    count = 0;
    localStorage.setItem("varname", count);
    $("#one").load("ranking.html"); //loads the page where users can vote
  } else {
    localStorage.setItem("varname", count);
    location.reload();
  }
}

//this function is used to print the body of the JSON file
function html(data) {
  if (data.type == "heading") {
    $("div")
      .add("<h1>" + data.model.text + "</h1>")
      .appendTo(document.getElementById("one"));
  } else if (data.type == "paragraph") {
    $("div")
      .add("<p>" + data.model.text + "</p>")
      .appendTo(document.getElementById("one"));
  } else if (data.type == "image") {
    $("div")
      .add(
        "<img src=" +
          data.model.url +
          " alt=" +
          data.model.altText +
          " height=" +
          data.model.height +
          " width=" +
          data.model.width +
          "/>"
      )
      .appendTo(document.getElementById("one"));
  } else if (data.type == "list") {
    if (data.model.type == "unordered") {
      $("div")
        .add("<ul>")
        .appendTo(document.getElementById("one"));
      $.each(data.model.items, function(i, dat) {
        $("div")
          .add("<li>" + dat + "</li>")
          .appendTo(document.getElementById("one"));
      });
      $("div")
        .add("</ul>")
        .appendTo(document.getElementById("one"));
    } else {
      //works if the json file contains ordered lists
      $("div")
        .add("<ol>")
        .appendTo(document.getElementById("one"));
      $.each(data.model.items, function(i, dat) {
        $("div")
          .add("<li>" + dat + "</li>")
          .appendTo(document.getElementById("one"));
      });
      $("div")
        .add("</ol>")
        .appendTo(document.getElementById("one"));
    }
  }
}

ourRequest.send();
