<template>
    <div>
        <div>
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :http-request="picUpload"
                    :on-success="handleSuccess"
                    multiple
                    :file-list="fileList"
                    :auto-upload="false">
                <template v-slot:trigger>
                    <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <template v-slot:tip>
                    <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
                    上传到服务器
                </el-button>
            </el-upload>
        </div>
        <div>
            <h3>这是你上传的图片：</h3>
            <img v-if="imageUrl!==''" :src="this.hostURL+imageUrl" style="width: 400px; height: 300px; margin-top: 10px">
            <span v-else>暂未收到图片</span>
        </div>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
            fileList: [],
            imageUrl: ''
        }
    },
    methods: {
        handleSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        submitUpload() {
            this.$refs.upload.submit();
            this.fileList = [];
        },
        picUpload(f) {
            let params = new FormData()
            //注意在这里一个坑f.file
            params.append("file", f.file);
            axios({
                method: 'post',
                //这里的id是我要改变用户的ID值
                url: '/upload',
                data: params,
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }).then(resp => {
                //这里返回的是头像的url
                console.log(resp);
                this.imageUrl = resp.obj;
            })
        }
    }
}
</script>
