/* global it expect describe beforeEach */

import React from 'react';
import sd from 'skin-deep';
const $ = React.createElement;

import Detail from '../../../src/components/app-intent/app-intent-add';

describe('Detail Component', () => {
  let tree;
  const props = {
    actions: {},
    appConfiguration: {
      availableServices: [
        { abbreviation: 'ha', name: 'Hadoop' },
        { abbreviation: 'el', name: 'ElasticSearch' },
      ],
      selectedServices: [
        { abbreviation: 'el', name: 'ElasticSearch' },
      ],
    },
  };

  beforeEach(() => {
    tree = sd.shallowRender(
      $(Detail, props,
        $('div', {className: 'someChild'}, 'bar')
      )
    );
  });

  it('should have children', () => {
    expect(tree.dive(['.app-intent-add__available-frameworks', 'text']).text()).to.eql('ha');
    expect(tree.dive(['.app-intent-add__selected-frameworks', 'text']).text()).to.eql('el');
  });
});
