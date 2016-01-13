/* global it expect describe beforeEach */

import React from 'react';
import sd from 'skin-deep';
const $ = React.createElement;

import Detail from '../../../src/components/detail';

describe('Detail Component', () => {
  let tree;
  let vdom;
  const props = {
    title: 'Hello',
    close: () => {
      return true;
    },
  };

  beforeEach(() => {
    tree = sd.shallowRender(
      $(Detail, props,
        $('div', {className: 'someChild'}, 'bar')
      )
    );
    vdom = tree.getRenderOutput();
  });

  it('should render with a correct class name', () => {
    expect(vdom.props.className).to.eql('detail paper');
  });

  it('should have children', () => {
    expect(tree.textIn('.someChild')).to.eql('bar');
  });

  it('should display children text', () => {
    expect(tree.textIn('.detail-title')).to.eql('Hello (close)');
  });
});
