import React, { Component } from 'react';
import Relay from 'react-relay';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedHTMLMessage,
  FormattedDate,
  defineMessages,
  injectIntl,
  intlShape,
} from 'react-intl';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import MDEdit from 'react-icons/lib/md/edit';
import PageTitle from '../PageTitle';
import Medias from '../media/Medias';
import MappedMessage from '../MappedMessage';
import Message from '../Message';
import Can from '../Can';
import CheckContext from '../../CheckContext';
import ContentColumn from '../layout/ContentColumn';
import ParsedText from '../ParsedText';

const messages = defineMessages({
  editError: {
    id: 'sourceComponent.editError',
    defaultMessage: 'Sorry, could not edit the source',
  },
  editSuccess: {
    id: 'sourceComponent.editSuccess',
    defaultMessage: 'Source information updated successfully!',
  },
});

class SourceComponent extends Component {

  constructor(props) {
    super(props);
    const source = this.props.source;
    this.state = {
      message: null,
      isEditing: false,
      submitDisabled: false,
      values: {
        name: source.name,
        description: source.description,
      },
    };
  }

  componentDidMount() {
    this.setContextSource();
  }

  componentDidUpdate() {
    this.setContextSource();
  }

  setContextSource() {
    // const context = new CheckContext(this);
    // const store = context.getContextStore();
    // const { team, project_id, source_id } = this.props.source;
    //
    // console.log('team');
    // console.log(team);
    // console.log('project_id');
    // console.log(project_id);
    // console.log('source_id');
    // console.log(source_id);
    //
    // const sourceUrl = `/${team.slug}/project/${project_id}/source/${source_id}`;
    //
    // if (!store.team || store.team.slug !== team.slug) {
    //   context.setContextStore({ team });
    //   // const path = `/${team.slug}`;
    //   store.history.push(sourceUrl);
    // }
  }

  render() {
    const source = this.props.source;
    const isEditing = this.state.isEditing;

    return (
      <PageTitle prefix={source.name} skipTeam={false} team={source.team}>
        <div className="source">
          <Card className="source__profile source__profile--editing">
            <ContentColumn>
              <Message message={this.state.message} />
                <div>
                  <section className="layout-two-column">
                    <div className="column-secondary">
                      <div
                        className="source__avatar"
                        style={{ backgroundImage: `url(${source.image})` }}
                      />
                    </div>
                    <div className="column-primary">
                      <div className="source__primary-info">
                        <h1 className="source__name">
                          {source.name}
                        </h1>
                        <div className="source__description">
                          <p className="source__description-text">
                            {<ParsedText text={source.description} /> ||
                              <MappedMessage
                                msgObj={messages}
                                msgKey="verificationTeam"
                              />}
                          </p>
                        </div>
                      </div>

                      <div className="source__contact-info">
                        <FormattedHTMLMessage id="sourceComponent.dateAdded" defaultMessage="Added {date} &bull; Source of {number} links"
                          values={{
                            date: this.props.intl.formatDate(source.created_at, { year: 'numeric', month: 'short', day: '2-digit'}),
                            number: source.medias.edges.length,
                          }}
                        />
                      </div>
                    </div>
                  </section>
                  <section className="layout-fab-container">
                    <Can
                      permissions={source.permissions}
                      permission="update Source"
                    >
                      <IconButton
                        className="source__edit-button"
                        tooltip={
                          <FormattedMessage
                            id="sourceComponent.editButton"
                            defaultMessage="Edit profile"
                          />
                        }
                        tooltipPosition="top-center"
                      >
                        <MDEdit />
                      </IconButton>
                    </Can>
                  </section>
                </div>
            </ContentColumn>
            {/*
              <CardActions>
              <FlatButton label={<FormattedMessage id="sourceComponent.notes" defaultMessage="Notes" />} />
              <FlatButton label={<FormattedMessage id="sourceComponent.medias" defaultMessage="Media" />} />
              <FlatButton label={<FormattedMessage id="sourceComponent.network" defaultMessage="Network" />} />
            </CardActions>
              */}
          </Card>
          <ContentColumn>
            <Medias medias={source.medias.edges} />
          </ContentColumn>
        </div>
      </PageTitle>
    );
  }
}

SourceComponent.propTypes = {
  intl: intlShape.isRequired,
  source: PropTypes.object,
};

SourceComponent.contextTypes = {
  store: React.PropTypes.object,
};

export default injectIntl(SourceComponent);
