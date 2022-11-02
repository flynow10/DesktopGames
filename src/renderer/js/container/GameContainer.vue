<script>
import { h, reactive, shallowReactive } from "vue";
import { Game } from "../core/games/Game";
import CenteredCanvas from './game-types/CenteredCanvas.vue';
export default {
  setup(props, { expose }) {
    const components = shallowReactive({
      CenteredCanvas,
    });
    const nodes = reactive([]);
    const newGame = (component) => {
      var node = h(components[component]);
      nodes.push(node);
      return node;
    }
    const removeGame = (index) => {
      nodes.splice(index, 1);
    }
    expose({
      newGame,
      removeGame
    });
    return () => nodes
  }
}
</script>