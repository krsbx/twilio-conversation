import _ from 'lodash';

export const createNameFilter = (search: string) => {
  const filters = _.compact([
    search && `firstname contains "${search}"`,
    search && `middlename contains "${search}"`,
    search && `surname contains "${search}"`,
  ]).join(' or ');

  return filters;
};
