<template>
    <section class="bar-chart">
        
        <div  v-for="(bar, idx) in chartData" :key="bar.name">
            <div>{{bar.name}}: {{bar.value}}</div>
            <Bar :color="colors[idx]" :value="bar.value"/>
        </div>

    </section>
</template>

<script>
import Bar from './Bar'
export default {
    name: 'PieChart',
    components: {
        Bar
    },
    props: {
        chartData: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        colors: ['red', 'blue']
    })
}
</script>

