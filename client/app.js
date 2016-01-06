document.title = "App title";

var _deps = new Deps.Dependency;
var searchCriteria = {};

Template.registerHelper('equals', function (a, b) {
  return a == b;
});

HomeController = RouteController.extend({
    layoutTemplate: 'layout',
    template: 'Home'
});

CourseCreateController = RouteController.extend({
    layoutTemplate: 'layout',
    template: 'Create'
});

CourseUpdateController = RouteController.extend({
    layoutTemplate: 'layout',
    template: 'Update'
});

CourseDetailController = RouteController.extend({
    layoutTemplate: 'layout',
    template: 'Detail'
});

Template.Home.onCreated(function(){
    var instance = this;

    instance.sort = new ReactiveVar(['createdAt', 'desc']);
    instance.page = new ReactiveVar(1);
    instance.search = new ReactiveVar('');
    instance.result = new ReactiveVar([]);

    instance.autorun(function(){
        sort = instance.sort.get();
        page = instance.page.get();
        search = instance.search.get();

        var subscribtion = instance.subscribe('Courses', instance.page.get(), instance.sort.get(), instance.search.get());
    });

    instance.courses = function() {
        return Courses.find({}, {sort : [instance.sort.get()]});
    }
});

Template.Home.helpers({
    courses : function() {
        return Template.instance().courses();
    },
    coursesCount : function() {
        return Template.instance().courses().count();
    },
    hasMoreCourses: function() {
        return Template.instance().courses().count() >= (Template.instance().page.get() * 10);
    }
});

Template.Home.events({
    'change #sorting': function(event, instance) {
        event.preventDefault();
        instance.sort.set(['createdAt', event.target.value]);
    },
    'click .load-more': function (event, instance) {
        event.preventDefault();
        var page = instance.page.get();

        page += 1;
        instance.page.set(page);
    },
    'keyup #search': function (event, instance) {
        event.preventDefault();
        instance.search.set(event.target.value);
    },
    'click .remove': function (event, instance) {
        event.preventDefault();
        Meteor.call('removeCourse', this._id);
    }
});

Template.Create.events({
    'submit form': function(event) {
        event.preventDefault();
        var name = event.target.name.value;
        var description = event.target.description.value;

        Meteor.call('addCourse', name, description);
        event.target.name.value = '';
        event.target.description.value = '';
        Router.go('/');
    }
});

Template.Update.events({
    'submit form': function(event) {
        event.preventDefault();
        var id = event.target.id.value;
        var name = event.target.name.value;
        var description = event.target.description.value;

        Meteor.call('updateCourse', id, name, description);

        event.target.id.value = '';
        event.target.name.value = '';
        event.target.description.value = '';
        Router.go('/');
    }
});