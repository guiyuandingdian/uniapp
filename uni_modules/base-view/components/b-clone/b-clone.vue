<template>
	<view class="b-clone fixAutoSmPd" :class="{'mb10': !isLast }">
		<view class="item">
			<slot></slot>
		</view>
		<view class="w1p" v-if="_showAddIcon || _showRemoveIcon">
			<view class="flex lt h40">
				<view @tap="_add" v-if="_showAddIcon">
					<block v-if="$slots.add">
						<slot name="add"></slot>
					</block>
					<block v-else>
						<view class="bIcon-addCircle hoverMain bold fz16"></view>
					</block>
				</view>
				<view @tap="_remove" v-if="_showRemoveIcon" :class="{ 'ml8' : _showAddIcon }">
					<block v-if="$slots.remove">
						<slot name="remove"></slot>
					</block>
					<block v-else>
						<view class="bIcon-subCircle hoverMain bold fz16" ></view>
					</block>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"b-clone",
		mixins : [uni.$b._mixins.family],
		data() {
			return {
				isLast : false ,
				index : -1 ,
				canRemove : false
			}
		},
		computed:{
			_showAddIcon(){
				return this.parent && this.parent._showAddIcon ;
			},
			_showRemoveIcon(){
				return this.parent && this.parent._showRemoveIcon ;
			}
		},
		created() {
			this.parent = this.getParent("b-maker") ;
			if (!this.parent) {
				throw new Error("b-clone should use with b-maker");
			}
			this.parent._setChildData();
		},
		methods: {
			_add(){
				this.parent && this.parent.add(this.index);
			},
			_remove(){
				this.parent && this.parent.remove(this.index);
			}
		}
	}
</script>