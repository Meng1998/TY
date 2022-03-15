using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;

namespace CsharpDemo
{
    class StructDef
    {
        //预览结构体
        [StructLayout(LayoutKind.Sequential)]
        public struct stPlayReq
        {
            public int iHardWareDecode;                             // 是否开启GPU硬解 0-不开启 1-开启
            public CsharpDemo.Delegate.pfnStreamCallback StreamCallBack;            // 码流数据回调
            public CsharpDemo.Delegate.pfnMsgCallback PlayMsgCallBack;              // 播放消息回调
            public CsharpDemo.Delegate.pfnDecodedDataCallback DecodeDataCallback;   // 解码后的YUV数据回调
            public IntPtr pUserData;                                                // 用户数据
            public string szResevre;                                                // 保留参数
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct stDownloadReq
        {
            public CsharpDemo.Delegate.pfnDownloadCallBack DownloadCallBack;    // 下载进度回调
            public IntPtr pUserData;                                            // 用户数据
            public long lFileMaxSize;                                           // 录像分包大小
            public long lRecordSize;                                            // 录像总大小，请填充查询回放URL时查询到的各录像片段大小之和
            public long lStartTimeStamp;                                        // 录像下载开始时间，请请填充查询回放URL时的查询开始时间戳，单位：秒
            public long lEndTimeStamp;                                          // 录像下载结束时间，请请填充查询回放URL时的查询结束时间戳，单位：秒
            public string szReserve;                                            // 保留参数
        }
    }
}
