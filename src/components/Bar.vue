<template>
    <section>
        <div :style="barStyles" class="bar"></div>
    </section>
</template>

<script>
export default {
    name: "Bar",
    props: {
        value: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    },
    computed: {
        barStyles() {
            return {
                width: `${this.value}%`,
                backgroundColor: this.color
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.bar {
    width: 0;
    height: 30px;
    transform: translateX(0%) scaleX(1);
    transition: all .3s;
}
</style>


