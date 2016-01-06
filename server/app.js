/*Meteor.startup(function() {
  Courses._dropIndex();

  Courses._ensureIndex({
      "description": "text"
  });
});
*/

Meteor.publish('Courses', function(page, sort, search) {

  if(search != '') {
    var regExp = buildRegExp(search);
    var selector = {$or: [
      {name: regExp},
      {description: regExp}
    ]};
    return Courses.find(selector, {sort: [sort], limit: (page * 10)});
  }

  return Courses.find({}, {sort: [sort], limit: (page * 10)});
});

Meteor.publish('CourseItems', function(id) {
  return Courses.find({_id:id});
});

Meteor.methods({
  addCourse: function (name, description) {
    Courses.insert({
      name: name,
      description: description,
      createdAt: new Date()
    });
  },
  updateCourse: function (id, name, description) {
    Courses.update(id, {
        $set: {name: name, description: description}
      }
    );
  },
  removeCourse: function(id) {
    Courses.remove(id)
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}