import {act, create} from 'react-test-renderer';
import TuitStats from '../components/tuits/tuit-stats';

test('stats render correctly for dislikes', () => {
    let stats = {
        dislikes: 12, replies: 234, retuits: 345
    }
    let tuitStats
    act(() => {
        tuitStats = create(
            <TuitStats
                dislikeTuit={() => {
                }} tuit={{stats: stats}}/>
        )
    })

    const root = tuitStats.root;
    const dislikesCounter = root.findByProps(
        {className: 'ttr-stats-dislikes'})
    const retuitsCounter = root.findByProps(
        {className: 'ttr-stats-retuits'})
    const repliesCounter = root.findByProps(
        {className: 'ttr-stats-replies'})
    const dislikeTuitButton = root.findByProps(
        {className: 'ttr-dislike-tuit-click'})
    let dislikesText = dislikesCounter.children[0];
    const repliesText = repliesCounter.children[0];
    const retuitsText = retuitsCounter.children[0];
    expect(dislikesText).toBe('12');
    expect(repliesText).toBe('234');
    expect(retuitsText).toBe('345');
})
