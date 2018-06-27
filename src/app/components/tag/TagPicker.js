import React from 'react';
import Relay from 'react-relay';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import isEqual from 'lodash.isequal';
import { FormGroup, FormControlLabel } from 'material-ui-next/Form';
import CheckboxNext from 'material-ui-next/Checkbox';
import styled from 'styled-components';
import difference from 'lodash.difference';
import intersection from 'lodash.intersection';
import CheckContext from '../../CheckContext';
import { black54, caption, units, opaqueBlack02, opaqueBlack05 } from '../../styles/js/shared';
import RelayContainer from '../../relay/RelayContainer';
import { createTag } from '../../relay/mutations/CreateTagMutation';
import { deleteTag } from '../../relay/mutations/DeleteTagMutation';
import MediaRoute from '../../relay/MediaRoute';

const StyledHeading = styled.div`
  color: ${black54};
  font: ${caption};
`;

const StyledNotFound = styled.div`
  color: ${black54};
  padding-top: ${units(15)};
  display: flex;
  justify-content: center;
`;

const StyledTagPickerArea = styled.div`
  padding: ${units(2)};
  height: ${units(32)};
  overflow-y: auto;
  border: 1px solid ${opaqueBlack05};
  background-color: ${opaqueBlack02};
`;

class TagPickerComponent extends React.Component {
  handleCreateTag(value) {
    const { media } = this.props;

    const context = new CheckContext(this).getContextStore();

    const onSuccess = () => {};
    const onFailure = () => {};

    createTag(
      {
        media,
        value,
        annotator: context.currentUser,
      },
      onSuccess, onFailure,
    );
  }

  handleRemoveTag = (value) => {
    const { media } = this.props;

    const removedTag = this.props.tags.find(tag => tag.node.tag === value);

    const onSuccess = () => {};
    const onFailure = () => {};

    deleteTag(
      {
        media,
        tagId: removedTag.node.id,
      },
      onSuccess, onFailure,
    );
  };

  handleSelectCheckbox = (e, inputChecked) => {
    if (inputChecked) {
      this.handleCreateTag(e.target.id);
    } else {
      this.handleRemoveTag(e.target.id);
    }
  }

  renderNotFound(shownTagsCount, totalTagsCount) {
    if (shownTagsCount > 0) {
      return null;
    }

    if (totalTagsCount === 0) {
      return (
        <StyledNotFound>
          <FormattedMessage
            id="tagPicker.emptyTags"
            defaultMessage="You currently have no tags added"
          />
        </StyledNotFound>
      );
    }

    return (
      <StyledNotFound>
        <FormattedMessage
          id="tagPicker.tagNotFound"
          defaultMessage='Tag "{tag}" not found'
          values={{ tag: this.props.value }}
        />
      </StyledNotFound>
    );
  }

  render() {
    const { media, tags, value } = this.props;

    const compareString = (tag, val) => tag.toLowerCase().includes(val.toLowerCase());

    // eslint-disable-next-line no-underscore-dangle
    const plainMediaTags = tags.filter(tag => !tag.__mutationStatus__).map(tag => tag.node.tag);

    const suggestedTags = media.team && media.team.get_suggested_tags
      ? media.team.get_suggested_tags.split(',').filter(tag => compareString(tag, value))
      : [];

    const nonRepeatedUsedTags =
      difference(media.team.used_tags, suggestedTags).filter(tag => compareString(tag, value));

    const checkedSuggestedTags = intersection(suggestedTags, plainMediaTags);
    const uncheckedSuggestedTags = difference(suggestedTags, plainMediaTags);

    const checkedUsedTags =
      difference(plainMediaTags, suggestedTags).filter(tag => compareString(tag, value));
    const uncheckedUsedTags = difference(nonRepeatedUsedTags, plainMediaTags);

    const shownSuggestedCount = checkedSuggestedTags.length + uncheckedSuggestedTags.length;
    const shownUsedCount = checkedUsedTags.length + uncheckedUsedTags.length;

    const shownTagsCount = shownSuggestedCount + shownUsedCount;
    const totalTagsCount = suggestedTags.length + tags.length + media.team.used_tags.length;

    return (
      <StyledTagPickerArea>
        <FormGroup>
          {
            shownSuggestedCount > 0 ?
              <StyledHeading>
                <FormattedMessage id="tagPicker.teamTags" defaultMessage="Team tags" />
              </StyledHeading>
              : null
          }
          {checkedSuggestedTags.concat(uncheckedSuggestedTags).map((tag, index) => (
            <FormControlLabel
              key={`team-suggested-tag-${index.toString()}`}
              control={
                <CheckboxNext
                  checked={plainMediaTags.includes(tag)}
                  onChange={this.handleSelectCheckbox}
                  id={tag}
                />
              }
              label={tag}
            />
          ))}
          {
            shownUsedCount > 0 ?
              <StyledHeading>
                <FormattedMessage id="tagPicker.teamOtherTags" defaultMessage="Other tags" />
              </StyledHeading>
              : null
          }
          {checkedUsedTags.concat(uncheckedUsedTags).map((tag, index) => (
            <FormControlLabel
              key={`team-used-tag-${index.toString()}`}
              control={
                <CheckboxNext
                  checked={plainMediaTags.includes(tag)}
                  onChange={this.handleSelectCheckbox}
                  id={tag}
                />
              }
              label={tag}
            />
          ))}
        </FormGroup>
        { this.renderNotFound(shownTagsCount, totalTagsCount) }
      </StyledTagPickerArea>
    );
  }
}

TagPickerComponent.contextTypes = {
  store: PropTypes.object,
};

const TagPickerContainer = Relay.createContainer(TagPickerComponent, {
  fragments: {
    media: () => Relay.QL`
      fragment on ProjectMedia {
        id
        dbid
        tags(first: 10000) {
          edges {
            node {
              tag,
              id
            }
          }
        }
        team {
          used_tags
          get_suggested_tags
        }
      }
    `,
  },
});

// eslint-disable-next-line react/no-multi-comp
class TagPicker extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate(nextProps, nextState) {
    if (isEqual(this.props, nextProps) && isEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  render() {
    const ids = `${this.props.media.dbid},${this.props.media.project_id}`;
    const route = new MediaRoute({ ids });

    return (
      <RelayContainer
        Component={TagPickerContainer}
        route={route}
        renderFetched={data => <TagPickerContainer {...this.props} {...data} />}
        forceFetch
      />
    );
  }
}

export default TagPicker;