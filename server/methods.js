Meteor.methods({
  updateSwipe: function(id, val){
    if(this.userId && Roles.userIsInRole(this.userId, ['admin'])){
      Members.update(id, {$set: {swipeAccess: val}});
    }
  },
  sendEmail: function (to, from, subject, text) {
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    if(this.userId && Roles.userIsInRole(this.userId, ['admin'])){
      Email.send({
        to: to,
        from: from,
        subject: subject,
        text: text
      });
    }
  },
  updateSlack: function(){
    console.log('slacking!');

    SlackAPI.users.list(Meteor.settings.SLACK_TOKEN, function(err,res){
        //console.log(err); // will return {"ok":false, "error":1, "args":{good:1, error:1}}
        console.log(res.members[0]); // will return undefined
        var users = Members.find({}, {_id:1,email:1}).fetch();
        console.log(users);
        var members = res.members;
        for(var i = 0; i < users.length; i++){
          var email = users[i].email;
          console.log(email);
          var found = false;
          for(var j = 0; j < members.length; j++){
            if(members[j].profile.email == email){
              found = true;
              break;
            }
          }
          Members.update({_id:users[i]._id}, {$set: {slackAccess:found}});
          console.log(found);
        }
    });


  }
});
