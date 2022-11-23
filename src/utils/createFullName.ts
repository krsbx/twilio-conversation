import _ from 'lodash';

export const createFullName = (user: ChatTemplate.Resource.User) =>
  _([user?.firstname, user?.middlename, user?.surname]).map(_.trim).compact().join(' ');
