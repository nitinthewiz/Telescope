import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import nikhcoCategories from "./collection.js";

// generate slug on insert
nikhcoCategories.before.insert(function (userId, doc) {
  // if no slug has been provided, generate one
  var slug = !!doc.slug ? doc.slug : Telescope.utils.slugify(doc.name);
  doc.slug = Telescope.utils.getUnusedSlug(nikhcoCategories, slug);
});

// generate slug on edit, if it has changed
nikhcoCategories.before.update(function (userId, doc, fieldNames, modifier) {
  if (modifier.$set && modifier.$set.slug && modifier.$set.slug !== doc.slug) {
    modifier.$set.slug = Telescope.utils.getUnusedSlug(nikhcoCategories, modifier.$set.slug);
  }
});

// add callback that adds categories CSS classes
function addCategoryClass (postClass, post) {
  var classArray = _.map(Posts.getnikhcoCategories(post), function (category){return "category-"+category.slug;});
  return postClass + " " + classArray.join(' ');
}
Telescope.callbacks.add("postClass", addCategoryClass);

// ------- nikhcoCategories Check -------- //

// make sure all categories in the post.categories array exist in the db
var checknikhcoCategories = function (post) {

  // if there are no categories, stop here
  if (!post.categories || post.categories.length === 0) {
    return;
  }

  // check how many of the categories given also exist in the db
  var categoryCount = nikhcoCategories.find({_id: {$in: post.categories}}).count();

  if (post.categories.length !== categoryCount) {
    throw new Meteor.Error('invalid_category', 'invalid_category');
  }
};

function postsNewChecknikhcoCategories (post) {
  checknikhcoCategories(post);
  return post;
}
Telescope.callbacks.add("posts.new.sync", postsNewChecknikhcoCategories);

function postEditChecknikhcoCategories (post) {
  checknikhcoCategories(post);
  return post;
}
Telescope.callbacks.add("posts.edit.sync", postEditChecknikhcoCategories);

// TODO: debug this

// function addParentnikhcoCategoriesOnSubmit (post) {
//   var categories = post.categories;
//   var newnikhcoCategories = [];
//   if (categories) {
//     categories.forEach(function (categoryId) {
//       var category = nikhcoCategories.findOne(categoryId);
//       newnikhcoCategories = newnikhcoCategories.concat(_.pluck(category.getParents().reverse(), "_id"));
//       newnikhcoCategories.push(category._id);
//     });
//   }
//   post.categories = _.unique(newnikhcoCategories);
//   return post;
// }
// Telescope.callbacks.add("posts.new.sync", addParentnikhcoCategoriesOnSubmit);

// function addParentnikhcoCategoriesOnEdit (modifier, post) {
//   if (modifier.$unset && modifier.$unset.categories !== undefined) {
//     return modifier;
//   }

//   var categories = modifier.$set.categories;
//   var newnikhcoCategories = [];
//   if (categories) {
//     categories.forEach(function (categoryId) {
//       var category = nikhcoCategories.findOne(categoryId);
//       newnikhcoCategories = newnikhcoCategories.concat(_.pluck(category.getParents().reverse(), "_id"));
//       newnikhcoCategories.push(category._id);
//     });
//   }
//   modifier.$set.categories = _.unique(newnikhcoCategories);
//   return modifier;
// }
// Telescope.callbacks.add("posts.edit.sync", addParentnikhcoCategoriesOnEdit);
