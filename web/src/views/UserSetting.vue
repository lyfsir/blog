<template>
  <div>
    <el-upload
      ref="upload"
      action
      :on-change="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
      :multiple="true"
      :limit="1"
      :on-exceed="fileExceed"
      accept=".jpg, .jpeg, .png, .JPG, .JPEG"
      list-type="picture-card"
    >
      <i slot="default" class="el-icon-plus"></i>
    </el-upload>
    <p style="font-family: '仿宋';padding-top: 20px">上传您的头像</p>
    <el-button type="primary" style="width: 200px;margin-top: 30px" @click="submitForm(fileList)">保存修改</el-button>
  </div>
</template>

<script>
    import {getoss} from "../api";
    import {updateUser} from "../api";

    export default {
        name: "UserSetting",
        data() {
            return {
                fileList: [],
                policyInfo: {},

            }
        },
        methods: {
            handleRemove(file, fileList) {
                this.fileList = fileList;
            },

            handlePreview(file, fileList) {
                let that = this;
                if (file.raw.size > 1024 * 1024 * 2) {
                    that.$message.error({
                        message: "上传文件大小不能超过 2MB!",
                        offset: 50,
                    });
                    return;
                }
                that.fileList = fileList;
            },
            fileExceed: function (files, fileList) {
                this.$message.warning(
                    {
                        message: `当前限制选择 1 个文件，本次选择了 ${
                            files.length
                        } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
                        offset: 50
                    }
                );
            },
            submitForm(fileList) {
                if (fileList.length == 0) {
                    this.$message.error({
                        message: "请完善信息"
                    });
                } else {
                    getoss().then(res => {
                        this.policyInfo = res.data
                        console.log("pil", this.policyInfo)
                        console.log("--------------", this.fileList);
                        if (fileList.length > 0) {
                            if (this.policyInfo != null) {
                                const res = this.policyInfo;
                                console.log(res);
                                //创建文件
                                console.log("----jq-------");
                                let imageurl = res.host + "/" + res.dir + this.fileList[0].name;
                                let formData = new FormData();
                                //表头信息
                                let config = {
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                    },
                                };
                                //添加文件信息
                                formData.append("policy", res.policy);
                                formData.append("OSSAccessKeyId", res.accessid);
                                formData.append("success_action_status", "200");
                                formData.append("signature", res.signature);
                                formData.append("key", res.dir + this.fileList[0].raw.name);
                                formData.append("file", this.fileList[0].raw);
                                const _this = this
                                this.$axios.post(
                                    "https://netcheck.oss-cn-heyuan.aliyuncs.com",
                                    formData,
                                    config).then(res => {
                                    console.log("成功");
                                    console.log("img", imageurl)
                                    let vo = {}
                                    vo.logo = imageurl
                                    updateUser(vo).then(res=>{
                                        if (res.code === 0) {
                                            _this.$alert('操作成功', '提示', {
                                                confirmButtonText: '确定',
                                                callback: action => {
                                                    _this.$router.push("/user")
                                                }
                                            });
                                        }
                                    })
                                })
                            }
                        }
                    })
                }

            }

        }
    }
</script>

<style scoped>

</style>
