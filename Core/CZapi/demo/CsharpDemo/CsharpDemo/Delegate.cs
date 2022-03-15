using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CsharpDemo
{
    class Delegate
    {
        /**@pfn <fnStreamCallBack>
        *  @brief  <预览、回放码流回调定义>
        *  @param  <lPlayHnadle，预览或回放的播放句柄>
                   <iStreamDataType，数据类型，0-头部 1-码流数据 2-结束标记>
                   <pDataArray，回调数据缓冲区，存储的是二进制数据>
                   <iDataLen，数据缓冲区大小，单位：字节>
                   <pUserData，用户数据>
        *  @note   <只用回放时才有结束标记>
                   <解析pDataArray时应当成二进制数据来解析>
        *  @return <无>
        */
        public delegate void pfnStreamCallback(long iPlayHandle, int iStreamDataType, IntPtr pArray, int iDataLen, IntPtr pUserData);

        /**@pfn <fnPlayMsgCallBack>
        *  @brief  <预览、回放播放和设备对讲消息回调>
        *  @param  <lPlayHnadle，预览或回放的播放句柄，对设备对讲无效>
                   <iMessageType，消息类型，1-播放开始 2-播放结束 3-播放停止 4-网络异常>
                   <pUserData，用户数据>
        *  @note   <消息类型后续可能会新增，请使用不超出已定义的消息类型值>
        *  @return <无>
        */
        public delegate void pfnMsgCallback(long iPlayHandle, int iMessageType, IntPtr pUserData);

        /**@pfn <pfnDecodedDataCallback>
        *  @brief  <预览、回放YUV数据回调>
        *  @param  <lPlayHnadle，预览或回放的播放句柄>
                   <pDataArray，回调数据缓冲区，存储的是二进制数据>
                   <iDataLen，数据缓冲区大小，单位：字节>
                   <iWidth，图像宽度>
                   <iHeight，图像高度>
                   <iYUVType，YUV类型，目前该值为3，代表类型YV12>
                   <iTimeStamp，时间戳>
                   <pUserData，用户数据>
        *  @note   <YUV数据指码流帧解码后的数据>
                   <解析pDataArray时应当成二进制数据来解析>
        *  @return <无>
        */
        public delegate void pfnDecodedDataCallback(long iPlayHandle, IntPtr pDataArray, int iDataLen, int iWidth, int iHeight, int iFrameType, int iTimeStamp, IntPtr pUserData);

        /**@pfn <pfnDownloadCallBack>
        *  @brief  <下载进度回调>
        *  @param  <lPlayHnadle，下载句柄>
                   <fPercent，已下载录像进度，当iMsg为0时进度有效>
                   <iMsg，录像下载消息，0-开始录像下载 1-录像下载中 2-录像下载完成 3-录像下载即将分包 4-录像下载分包失败 5-录像下载分包完成 6-录像下载时断流>
                   <pUserData，用户数据>
        *  @return <无>
        */
        public delegate void pfnDownloadCallBack(long lPlayHandle, float fPercent, int iMsg, IntPtr pUserData);
    }
}
