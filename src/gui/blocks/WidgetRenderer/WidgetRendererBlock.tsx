import React, { ReactNode } from 'react';
import Block from '../Block';
import { makeStyles, createStyles } from '@material-ui/core';
import WidgetRendererBehavior from './WidgetRendererBehavior';
import { useBehavior, useObservable } from '../hooks';

const useStyles = makeStyles(() =>
  createStyles({
    actions: {
      padding: 4,
    },
  }),
);

export default function WidgetRendererBlock(props: { id: string }) {
  const classes = useStyles();
  const behavior = useBehavior<WidgetRendererBehavior>(props.id);
  const widget = useObservable(behavior.widget) as ReactNode;

  return (
    <Block id={props.id}>
      <div className={classes.actions}>{widget}</div>
    </Block>
  );
}
