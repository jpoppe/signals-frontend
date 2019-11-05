import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import categories from 'utils/__tests__/fixtures/categories.json';

import DefaultTextsForm from './index';

describe('<DefaultTextsForm />', () => {
  let props;

  beforeEach(() => {
    props = {
      defaultTexts: [{
        title: 'title 1',
        text: 'text 1',
      }, {
        title: 'title 2',
        text: 'text 2',
      }, {
        title: 'title 3',
        text: 'text 3',
      }],
      subCategories: categories.sub,
      categoryUrl: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
      state: 'o',

      onSubmitTexts: jest.fn(),
      onOrderDefaultTexts: jest.fn(),
      onSaveDefaultTextsItem: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render form correctly', () => {
    const fields = [...Array(10).keys()];
    const { queryByTestId } = render(
      withAppContext(<DefaultTextsForm {...props} />)
    );

    expect(queryByTestId('defaultTextFormForm')).not.toBeNull();

    fields.forEach(i => {
      expect(queryByTestId(`title${i}`)).not.toBeNull();
      expect(queryByTestId(`text${i}`)).not.toBeNull();
    });

    expect(queryByTestId('defaultTextFormItemButton0Up')).toBeDisabled();
    expect(queryByTestId('defaultTextFormItemButton0Down')).not.toBeDisabled();
    expect(queryByTestId('defaultTextFormItemButton1Up')).not.toBeDisabled();
    expect(queryByTestId('defaultTextFormItemButton1Down')).not.toBeDisabled();
    expect(queryByTestId('defaultTextFormItemButton2Up')).not.toBeDisabled();
    expect(queryByTestId('defaultTextFormItemButton2Down')).toBeDisabled();
    expect(queryByTestId('defaultTextFormItemButton3Up')).toBeDisabled();
    expect(queryByTestId('defaultTextFormItemButton3Down')).toBeDisabled();

    expect(queryByTestId('defaultTextFormSubmitButton')).not.toBeNull();
  });

  describe('events', () => {
    it('should trigger save default texts when a new title has been entered', () => {
      props.defaultTexts = [];
      const { getByTestId } = render(
        withAppContext(<DefaultTextsForm {...props} />)
      );

      const newTitle = 'Titel ipsum';
      const event = {
        target: {
          value: newTitle,
        },
      };
      fireEvent.change(getByTestId('title4'), event);

      expect(props.onSaveDefaultTextsItem).toHaveBeenCalledWith({
        index: 4,
        data: {
          text: '',
          title: newTitle,
        },
      });
    });
  });

  it('should trigger save default texts when a new text has been entered', () => {
    props.defaultTexts = [];
    const { getByTestId } = render(
      withAppContext(<DefaultTextsForm {...props} />)
    );

    const newText = 'lorem ipsum';
    const event = {
      target: {
        value: newText,
      },
    };
    fireEvent.change(getByTestId('text1'), event);

    expect(props.onSaveDefaultTextsItem).toHaveBeenCalledWith({
      index: 1,
      data: {
        text: newText,
        title: '',
      },
    });
  });

  it('should trigger order default texts when ordering up and down button was called', () => {
    const { getByTestId } = render(
      withAppContext(<DefaultTextsForm {...props} />)
    );

    fireEvent.click(getByTestId('defaultTextFormItemButton1Down'));

    expect(props.onOrderDefaultTexts).toHaveBeenCalledWith({ index: 1, type: 'down' });

    fireEvent.click(getByTestId('defaultTextFormItemButton1Up'));

    expect(props.onOrderDefaultTexts).toHaveBeenCalledWith({ index: 1, type: 'up' });
  });

  it('should trigger order submit when sumbit button is clicked', () => {
    const { getByTestId } = render(
      withAppContext(<DefaultTextsForm {...props} />)
    );

    // expect(getByTestId('defaultTextFormSubmitButton')).toBeDisabled();
    fireEvent.click(getByTestId('defaultTextFormSubmitButton'));

    expect(props.onSubmitTexts).toHaveBeenCalledWith({
      main_slug: 'afval',
      sub_slug: 'asbest-accu',
      post: {
        state: 'o',
        templates: props.defaultTexts,
      },
    });
  });
});

