/* global it expect describe beforeEach */

import React from 'react';
import sd from 'skin-deep';
const $ = React.createElement;

import Button from '../../../src/components/button';

describe('Button Component', () => {
  let tree;
  let vdom;
  const props = {
    children: 'Foo',
  };

  beforeEach(() => {
    tree = sd.shallowRender($(Button, props));
    vdom = tree.getRenderOutput();
  });

  it('should render with a correct class name', () => {
    expect(vdom.props.className).to.eql('button');
  });

  it('should display children inside it', () => {
    expect(vdom.props).to.have.property('children', 'Foo');
  });
});
