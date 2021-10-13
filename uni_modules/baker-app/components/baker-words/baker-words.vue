<template>
	<view>
		{{_words}}
	</view>
</template>

<script>
	export default {
		name:"baker-words",
		props:{
			words : [String,Number]
		},
		computed: {
			_words() {
				let words = Number(this.words );
				if (isNaN(words)) {
					return "" ;
				}
				return this.getWords(words) + "字" ;
			}
		},
		methods:{
			getWords(words){
				if (words < 10000) {
					return words ;
				}
				if (words < 100000) {
					return (words/10000).toFixed(2) + "万" ;
				}
				return parseInt(words/10000) + "万" ;
			}
		}
	}
</script>