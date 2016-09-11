import nikhcoCategories from './collection.js'
import PublicationsUtils from 'meteor/utilities:smart-publications';

nikhcoCategories.publishedFields = {};

/**
 * @summary Specify which fields should be published by the categories publication
 * @array nikhcoCategories.publishedFields.list
 */
nikhcoCategories.publishedFields.list = PublicationsUtils.arrayToFields([
  "name",
  "description",
  "order",
  "slug",
  "image",
  "parentId",
]);