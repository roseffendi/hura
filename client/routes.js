Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {
    name: 'home'
});

Router.route('/course-create', {
    name: 'course.create'
});

Router.route('/course-detail:_id', {
    name: 'course.detail',
    subscriptions: function() {
        this.subscribe('CourseItems', this.params._id);
    },
    data: function() {
        return Courses.findOne({_id:this.params._id});
    }
});

Router.route('/course-update/:_id', {
    name: 'course.update',
    subscriptions: function() {
        this.subscribe('CourseItems', this.params._id);
    },
    data: function() {
        return Courses.findOne({_id:this.params._id});
    }
});