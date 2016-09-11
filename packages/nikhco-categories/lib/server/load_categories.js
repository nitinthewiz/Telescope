import Telescope from 'meteor/nova:lib';
import nikhcoCategories from "../collection.js";

// Load categories from settings, if there are any

if (Meteor.settings && Meteor.settings.categories) {
  Meteor.settings.categories.forEach(category => {

    // get slug (or slugified name)
    const slug = category.slug || Telescope.utils.slugify(category.name);

    // look for existing category with same slug
    let existingCategory = nikhcoCategories.findOne({slug: slug});

    if (existingCategory) {
      // if category exists, update it with settings data except slug
      delete category.slug;
      nikhcoCategories.update(existingCategory._id, {$set: category});
    } else {
      // if not, create it
      nikhcoCategories.insert(category);
      console.log(`// Creating category “${category.name}”`);
    }
  });
}
