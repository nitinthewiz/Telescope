import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import nikhcoCategories from "./collection.js";

nikhcoCategories.helpers({getCollection: () => nikhcoCategories});
nikhcoCategories.helpers({getCollectionName: () => "categories"});

/**
 * @summary Get all of a category's parents
 * @param {Object} category
 */
nikhcoCategories.getParents = function (category) {
  var categoriesArray = [];

  var getParents = function recurse (category) {
    var parent;
    if (parent = nikhcoCategories.findOne(category.parentId)) {
      categoriesArray.push(parent);
      recurse(parent);
    }
  }(category);

  return categoriesArray;
};
nikhcoCategories.helpers({getParents: function () {return nikhcoCategories.getParents(this);}});

/**
 * @summary Get all of a category's children
 * @param {Object} category
 */
nikhcoCategories.getChildren = function (category) {
  var categoriesArray = [];

  var getChildren = function recurse (categories) {
    var children = nikhcoCategories.find({parentId: {$in: _.pluck(categories, "_id")}}).fetch()
    if (children.length > 0) {
      categoriesArray = categoriesArray.concat(children);
      recurse(children);
    }
  }([category]);

  return categoriesArray;
};
nikhcoCategories.helpers({getChildren: function () {return nikhcoCategories.getChildren(this);}});

/**
 * @summary Get all of a post's categories
 * @param {Object} post
 */
Posts.getCategories = function (post) {
  return !!post.categories ? nikhcoCategories.find({_id: {$in: post.categories}}).fetch() : [];
};
Posts.helpers({getCategories: function () {return Posts.getCategories(this);}});

/**
 * @summary Get a category's URL
 * @param {Object} category
 */
nikhcoCategories.getUrl = function (category, isAbsolute) {
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  // return prefix + FlowRouter.path("postsCategory", category);
  return `${prefix}/?category=${category.slug}`;
};
nikhcoCategories.helpers({getUrl: function () {return nikhcoCategories.getUrl(this);}});

/**
 * @summary Get a category's counter name
 * @param {Object} category
 */
 nikhcoCategories.getCounterName = function (category) {
  return category._id + "-postsCount";
 }
 nikhcoCategories.helpers({getCounterName: function () {return nikhcoCategories.getCounterName(this);}});
