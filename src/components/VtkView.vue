<template>
  <div ref="renderWindowContainer" style="width: 100%; height: 100%;"></div>
</template>

<script>

/* global vtk */
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';

export default {
  name: 'VtkView',
  props: {
    modelUrl: String
  },
  mounted() {
    this.fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      background: [0, 0, 0],
      container: this.$refs.renderWindowContainer
    });
    this.renderer = this.fullScreenRenderer.getRenderer();
    this.renderWindow = this.fullScreenRenderer.getRenderWindow();

    this.reader = vtkXMLPolyDataReader.newInstance();
    this.reader.setUrl(this.modelUrl, { loadData: true }).then(() => {
      const dataset = this.reader.getOutputData();
      const actor = vtk.Rendering.Core.vtkActor.newInstance();
      actor.setMapper(vtk.Rendering.Core.vtkMapper.newInstance({ inputData: dataset }));
      this.renderer.addActor(actor);
      this.renderWindow.render();
    });
  }
};
</script>
