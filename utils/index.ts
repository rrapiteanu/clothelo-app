import clone from 'lodash/clone';
import map from 'lodash/map';

export function isUrlImage(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

export const cloneArray = arr => {
  return map(arr, clone);
};
