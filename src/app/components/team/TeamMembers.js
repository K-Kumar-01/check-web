import React from 'react';
import Relay from 'react-relay/compat';
import TeamRoute from '../../relay/TeamRoute';
import TeamMembersComponent from './TeamMembersComponent';

const TeamMembersContainer = Relay.createContainer(TeamMembersComponent, {
  initialVariables: {
    pageSize: 20,
  },
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id,
        dbid,
        name,
        slug,
        permissions,
        get_max_number_of_members,
        members_count,
        invited_mails,
        join_requests(first: 100) {
          edges {
            node {
              id,
              assignments_progress,
              user {
                id,
                dbid,
                name,
                is_active,
                source {
                  id,
                  dbid,
                  image,
                }
              }
              team {
                id
                slug
              },
            }
          }
        },
        team_users(first: $pageSize) {
          edges {
            node {
              user {
                id,
                dbid,
                name,
                email,
                is_active,
                source {
                  id,
                  dbid,
                  image,
                }
              },
              team {
                name
                slug
              },
              status,
              team_id,
              user_id,
              id,
              role,
              assignments_progress
            }
          }
        },
      }
    `,
  },
});

const TeamMembers = (props) => {
  const route = new TeamRoute({ teamSlug: props.teamSlug });
  return (<Relay.RootContainer
    Component={TeamMembersContainer}
    route={route}
  />);
};

export default TeamMembers;
