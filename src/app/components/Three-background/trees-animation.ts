import gsap from 'gsap';
import $ from 'jquery';
import './DrawSVGPlugin.js';
import { tree1, tree2 } from './tree-svgs';
import { applyTreeRandomStyles } from './tree-random-styles';

const TREE_COUNT = 50;

function getBranchPaths(): SVGPathElement[] {
  const container = document.querySelector('#trees-container');
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<SVGPathElement>('.tree path:not(.trunk)')
  ).filter((path) => typeof path.getTotalLength === 'function');
}

export function spawnTrees() {
  const container = document.querySelector('#trees-container');
  const treesRoot = document.querySelector('#trees');
  if (!container || !treesRoot) return;

  buildTrees(TREE_COUNT);

  const branches = getBranchPaths();
  if (branches.length > 0) {
    gsap.set(branches, { drawSVG: 0 });
  }
  animateTrees();
}

export function killTrees() {
  gsap.killTweensOf('#trees');
  gsap.killTweensOf('#trees-container');
  gsap.killTweensOf('#floor');
  gsap.killTweensOf('.tree');
  gsap.killTweensOf('.tree path');
  $('#trees').empty();
  gsap.set('#floor', { height: 0 });
  gsap.set('#trees', { autoAlpha: 1, clearProps: 'autoAlpha' });
}

function animateTrees() {
  document.querySelectorAll('.tree').forEach(function (tree, i) {
    const branches = $('path:not(.trunk)', tree);
    const leftBranches = $('path.left', tree);
    const rightBranches = $('path.right', tree);
    const floor = $('#floor');
    const tl = gsap.timeline({ delay: i * 0.25 });

    gsap.to(floor, { duration: 0.3, height: 53 });
    gsap.set(leftBranches, { rotation: -20, transformOrigin: 'top right' });
    gsap.set(rightBranches, { rotation: 20 });

    tl.to(tree, {
      duration: 0.75,
      attr: { viewBox: '15 -3 20 40' },
      ease: 'back.out(1)',
    })
      .to(
        branches,
        { duration: 0.5, drawSVG: '100%', ease: 'power1', stagger: 0.03 },
        '-=0.25'
      )
      .to(
        branches,
        { duration: 2, rotation: 0, ease: 'elastic', stagger: 0.03 },
        '-=1.25'
      );
  });
}

function buildTrees(count: number) {
  const trees = $('#trees');
  const container = $('#trees-container');

  trees.empty();
  gsap.set([container, trees], { display: 'block', autoAlpha: 1 });
  for (let i = 0; i < count; i++) {
    trees.append(Math.random() > 0.25 ? tree1 : tree2);
    const el = trees.children().last().get(0);
    if (el instanceof SVGSVGElement) {
      applyTreeRandomStyles(el);
    }
  }
}

