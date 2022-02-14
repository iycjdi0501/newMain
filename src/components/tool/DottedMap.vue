<template>
  <div class="map-container">
    <ul v-for="(line, index) in map" :key="index + 'line'">
      <li
        v-for="(dot, index) in line"
        :key="index + 'dot'"
        :class="[table[dot], { active: table[dot] === over }]"
      />
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    mapData: {
      type: Object,
      required: true,
    },
    over: {
      type: String,
    },
  },
  data() {
    return {
      map: this.mapData.map,
      table: this.mapData.table,
    }
  },
}
</script>

<style lang="scss" scoped>
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  ul {
    display: flex;
  }

  li {
    list-style-type: none;
    max-width: 7px;
    max-height: 7px;
    width: 0.3vw;
    height: 0.3vw;
    min-width: 4px;
    min-height: 4px;
    margin: 2px;
    position: relative;

    &.용산구 {
      background-color: #ca6165;
    }

    &.강남구 {
      background-color: #ff0000;
    }

    &.강서구 {
      background-color: #4db700;
    }

    &.강동구 {
      background-color: #ecde00;
    }

    &.강북구 {
      background-color: #009de6;
    }

    &.은평구 {
      background-color: #119f8a;
    }

    &.송파구 {
      background-color: #ffc200;
    }

    &.금천구 {
      background-color: #fff462;
    }

    &.도봉구 {
      background-color: #5b92e5;
    }

    &.노원구 {
      background-color: #0033ff;
    }

    &.광진구 {
      background-color: #b677ff;
    }

    &.성북구 {
      background-color: #ffbfca;
    }

    &.종로구 {
      background-color: #84c07a;
    }

    &.중랑구 {
      background-color: #ff3300;
    }

    &.서대문구 {
      background-color: #00ffff;
    }

    &.동대문구 {
      background-color: #b9eeff;
    }

    &.관악구 {
      background-color: #7fffd4;
    }

    &.동작구 {
      background-color: #ff0063;
    }

    &.구로구 {
      background-color: #ff69b4;
    }

    &.서초구 {
      background-color: #6ead5c;
    }

    &.양천구 {
      background-color: #37b5be;
    }

    &.마포구 {
      background-color: #21453b;
    }

    &.성동구 {
      background-color: #283362;
    }

    &.중구 {
      background-color: #0dee2b;
    }

    &.영등포구 {
      background-color: #e8de73;
    }

    &.수원시 {
      background-color: #7bbe5f;
    }

    &.성남시 {
      background-color: #ca8c66;
    }

    &.고양시 {
      background-color: #3e21a3;
    }

    &.용인시 {
      background-color: #732131;
    }

    &.부천시 {
      background-color: #89fc52;
    }

    &.안산시 {
      background-color: #abfdef;
    }

    &.안양시 {
      background-color: #197555;
    }

    &.남양주시 {
      background-color: #df3a9d;
    }

    &.화성시 {
      background-color: #d088fb;
    }

    &.의정부시 {
      background-color: #e9d8fd;
    }

    &.시흥시 {
      background-color: #53fc02;
    }

    &.평택시 {
      background-color: #154048;
    }

    &.광명시 {
      background-color: #4a78da;
    }

    &.파주시 {
      background-color: #daa8a4;
    }

    &.군포시 {
      background-color: #428b57;
    }

    &.광주시 {
      background-color: #4228f9;
    }

    &.김포시 {
      background-color: #ac2d7f;
    }

    &.이천시 {
      background-color: #048750;
    }

    &.양주시 {
      background-color: #55ffa0;
    }

    &.구리시 {
      background-color: #3ce3be;
    }

    &.오산시 {
      background-color: #f8888f;
    }

    &.안성시 {
      background-color: #0a84b3;
    }

    &.의왕시 {
      background-color: #f65a86;
    }

    &.하남시 {
      background-color: #e22414;
    }

    &.포천시 {
      background-color: #70f744;
    }

    &.동두천시 {
      background-color: #8b692c;
    }

    &.과천시 {
      background-color: #daf29d;
    }

    &.여주시 {
      background-color: #b299c3;
    }

    &.양평군 {
      background-color: #34ddb5;
    }

    &.가평군 {
      background-color: #5c6350;
    }

    &.연천군 {
      background-color: #379499;
    }

    &.background {
      background-color: transparent;
    }

    &:not(.background):before {
      content: '';
      transition: 0.3s;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #aaaaaa;
    }

    &.active:before {
      background-color: inherit;
      filter: blur(10px) saturate(3);
    }
  }
}
</style>
