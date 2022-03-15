using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CsharpDemo
{
    public partial class Form1 : Form
    {
        long lPlayHandle = -1;
        long lDownloadHandle = -1;
        string szDownloadMessage;
        System.Timers.Timer tDownloadUpdateMessage;
        //long lPreviewHandle = -1;
        //long lPlaybackHandle = -1;

        public static void pfnStreamCallback(long iPlayHandle, int iStreamDataType, IntPtr pArray, int iDataLen, IntPtr pUserData)
        {
            int i = (int)pUserData;
        }

        public static void pfnDownloadCallBack(long lPlayHandle, float fPercent, int iMsg, IntPtr pUserData)
        {
            //Form1 clsForm = (Form1)pUserData;
            //pUserData.textBox_DownloadPrecent.Text = fPercent;
        }

        public void pfnDownloadCallBack2(long lPlayHandle, float fPercent, int iMsg, IntPtr pUserData)
        {
            //Form1 clsForm = (Form1)pUserData;
            string szMessage;
            switch (iMsg)
            {
                case 0:
                    szMessage = "开始录像下载";
                    break;
                case 1:
                    szMessage = "录像下载中";
                    break;
                case 2:
                    szMessage = "录像下载完成";
                    break;
                case 3:
                    szMessage = "录像下载即将分包";
                    break;
                case 4:
                    szMessage = "录像下载分包失败";
                    break;
                case 5:
                    szMessage = "录像下载分包完成";
                    break;
                case 6:
                    szMessage = "录像下载断流";
                    break;
                default:
                    szMessage = "其他错误";
                    break;
            }

            szMessage += ",当前进度:" + fPercent;
            if (iMsg != 1)          //其他信息则更新
            {
                _UpdateDownloadMessage(szMessage);
                //下载完成、下载断流后停止定时器逻辑
                if (2 == iMsg || 6 == iMsg)
                {
                    tDownloadUpdateMessage.Elapsed -= new System.Timers.ElapsedEventHandler(theout);
                    tDownloadUpdateMessage.AutoReset = false;
                    tDownloadUpdateMessage.Enabled = false;
                    tDownloadUpdateMessage.Stop();
                    tDownloadUpdateMessage.Dispose();
                }
            }
            else                    //下载中的进度信息定时更新，避免回调中耗时导致拖慢下载速度问题
            {
                szDownloadMessage = szMessage;
            }
        }

        #region 事件码流回调定义
        private CsharpDemo.Delegate.pfnStreamCallback _OnStreamCallBack = new CsharpDemo.Delegate.pfnStreamCallback(pfnStreamCallback);
        private CsharpDemo.Delegate.pfnMsgCallback _OnDecodedDataCallBack = null;
        private CsharpDemo.Delegate.pfnDecodedDataCallback _OnMsgCallBack = null;
        private CsharpDemo.Delegate.pfnDownloadCallBack _OnDownloadCallBack = new CsharpDemo.Delegate.pfnDownloadCallBack(pfnDownloadCallBack);

        private CsharpDemo.Delegate.pfnDownloadCallBack pfnDownloadCallBackTest;
        #endregion

        public void _UpdataMessage(string szMessage)
        {
            this.textBox_Result.Text += szMessage + "\r\n";
        }

        public void _UpdateDownloadMessage(string szMessage)
        {
            this.textBox_DownloadPrecent.Text += szMessage + "\r\n";//fPercent.ToString();
        }

        public long DataTimeConvertTimeStamp(DateTime dtSourceTime)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1)); // 当地时区
            long ltimeStamp = (long)(dtSourceTime - startTime).TotalSeconds; // 相差秒数
            return ltimeStamp;
        }

        public Form1()
        {
            InitializeComponent();
            Control.CheckForIllegalCrossThreadCalls = false;
            this.textBox_Result.Clear();
            this.comBox_Speed.SelectedIndex = 4;
            //设置回放、下载时间控件为当天的0点-23:59:59
            this.dateTimePicker_PlaybackEnd.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59);
            this.dateTimePicker_PlaybackBegin.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
            this.dateTimePicker_DownloadEnd.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59);
            this.dateTimePicker_DownloadBegin.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
            this.textBox_DownloadPackageSize.Text = (100 * 1024 * 1024).ToString();           //分包大小100M
            this.textBox_SnapFile.Text = "D:/test/test.jpg";
            this.textBox_DownloadFile.Text = "D:/test/test.mp4";

            //this.textBox_PlaybackUrl.Text = "";
            //this.dateTimePicker_PlaybackBegin.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 15, 20, 43);
            //this.dateTimePicker_PlaybackEnd.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 15, 26, 35);

            //创建下载进程回调函数
            pfnDownloadCallBackTest = new CsharpDemo.Delegate.pfnDownloadCallBack(pfnDownloadCallBack2);

            //this.textBox_DownloadUrl.Text = "";
            //this.dateTimePicker_DownloadBegin.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 00, 00, 00);
            //this.dateTimePicker_DownloadEnd.Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 00, 10, 00);
            //this.textBox_DownloadSize.Text = "2146435072";
        }

        private void Btn_Init_Click(object sender, EventArgs e)
        {
            int iRet = CsharpDemo.InterfaceDef.Video_Init("");
            string szMessage = "Video_Init return :" + iRet + (0 == iRet ? "，调用成功" : "，调用失败");
            if (iRet != 0)
            {
                int iErrCode = CsharpDemo.InterfaceDef.Video_GetLastError();
                szMessage += "，错误码：" + iErrCode;
            }
            _UpdataMessage(szMessage);
        }

        private void Btn_Fini_Click(object sender, EventArgs e)
        {
            int iRet = CsharpDemo.InterfaceDef.Video_Fini();
            string szMessage = "Video_Fini return :" + iRet + (0 == iRet ? "，调用成功" : "，调用失败");
            if (iRet != 0)
            {
                int iErrCode = CsharpDemo.InterfaceDef.Video_GetLastError();
                szMessage += "，错误码：" + iErrCode;
            }
            _UpdataMessage(szMessage);
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            //int iRet = CsharpDemo.InterfaceDef.Video_Fini();
            //this.textBox_Result.Text = "Video_Fini return :" + iRet + (0 == iRet ? "，调用成功" : "，调用失败");
        }

        private void Form1_FormClosing(object sender, EventArgs e)
        {
            Btn_StopPreview_Click(sender, e);
            Btn_StopPlayback_Click(sender, e);
            Btn_StopDownload_Click(sender, e);
            //CsharpDemo.InterfaceDef.Video_Fini();
        }

        // 保证状态显示框一直显示最新的内容 - 即一直显示最后一行的内容
        private void textBox_Result_TextChanged(object sender, EventArgs e)
        {
            this.textBox_Result.SelectionStart = this.textBox_Result.Text.Length;
            this.textBox_Result.ScrollToCaret();
        }

        private void textBox_DownloadPrecent_TextChanged(object sender, EventArgs e)
        {
            this.textBox_DownloadPrecent.SelectionStart = this.textBox_DownloadPrecent.Text.Length;
            this.textBox_DownloadPrecent.ScrollToCaret();
        }

        private void Btn_StartPreview_Click(object sender, EventArgs e)
        {
            if (lPlayHandle > 0)
            {
                _UpdataMessage("预览失败，当前窗口正在播放");
                return;
            }

            CsharpDemo.StructDef.stPlayReq stPlayReq = new StructDef.stPlayReq()
            {
                iHardWareDecode = 0,
                StreamCallBack = _OnStreamCallBack,
                PlayMsgCallBack = _OnDecodedDataCallBack,
                DecodeDataCallback = _OnMsgCallBack,
                pUserData = new IntPtr(1)
            };
            string szPreviewUrl = this.textBox_PreviewUrl.Text;
            szPreviewUrl = szPreviewUrl.Trim();
            IntPtr _pPreviewWndHandle = this.pictureBox_Play.Handle;
            long lRet = CsharpDemo.InterfaceDef.Video_StartPreview(szPreviewUrl, _pPreviewWndHandle, ref stPlayReq);
            if (lRet > 0)
            {
                lPlayHandle = lRet;
                string szMessage = "Video_StartPreview return:" + lRet + "预览成功";
                _UpdataMessage(szMessage);
            }
            else
            {
                lPlayHandle = -1;
                string szMessage = "Video_StartPreview return:" + lRet + ", errcode:" + ", 预览失败";
                int iErrCode = CsharpDemo.InterfaceDef.Video_GetLastError();
                szMessage += "，错误码：" + iErrCode;
                _UpdataMessage(szMessage);
            }
        }

        private void Btn_StopPreview_Click(object sender, EventArgs e)
        {
            //this.pictureBox_Play.CreateGraphics().Clear();
            if (lPlayHandle < 0)
            {
                _UpdataMessage("停止预览失败，当前没有播放");
                return;
            }

            int iRet = CsharpDemo.InterfaceDef.Video_StopPreview(lPlayHandle);
            if (0 == iRet)
            {
                // 刷新窗口画面
                this.pictureBox_Play.Refresh();
                lPlayHandle = -1;
                string szMessage = "Video_StopPreview return:" + iRet + "停止预览成功";
                _UpdataMessage(szMessage);
            }
            else
            {
                string szMessage = "Video_StopPreview return:" + iRet + ", errcode:" + ", 停止预览失败";
                int iErrCode = CsharpDemo.InterfaceDef.Video_GetLastError();
                szMessage += "，错误码：" + iErrCode;
                _UpdataMessage(szMessage);
            }
        }

        private void Btn_StartPlayback_Click(object sender, EventArgs e)
        {
            if (lPlayHandle > 0)
            {
                _UpdataMessage("回放失败，当前窗口正在播放");
                return;
            }

            CsharpDemo.StructDef.stPlayReq stPlayReq = new StructDef.stPlayReq()
            {
                iHardWareDecode = 0,
                StreamCallBack = _OnStreamCallBack,
                PlayMsgCallBack = _OnDecodedDataCallBack,
                DecodeDataCallback = _OnMsgCallBack,
                pUserData = IntPtr.Zero
            };
            string szPlaybackUrl = this.textBox_PlaybackUrl.Text;
            IntPtr _pPreviewWndHandle = this.pictureBox_Play.Handle;
            DateTime dtStartTime = this.dateTimePicker_PlaybackBegin.Value;
            DateTime dtEndTime = this.dateTimePicker_PlaybackEnd.Value;
            long lStartTime = DataTimeConvertTimeStamp(dtStartTime);
            long lEndTime = DataTimeConvertTimeStamp(dtEndTime);
            szPlaybackUrl = szPlaybackUrl.Trim();
            long lRet = CsharpDemo.InterfaceDef.Video_StartPlayback(szPlaybackUrl, _pPreviewWndHandle, lStartTime, lEndTime, ref stPlayReq);
            if (lRet > 0)
            {
                lPlayHandle = lRet;
                string szMessage = "Video_StartPlayback return:" + lRet + "回放成功";
                _UpdataMessage(szMessage);
            }
            else
            {
                lPlayHandle = -1;
                string szMessage = "Video_StartPlayback return:" + lRet + ", errcode:" + ", 回放失败";
                int iErrCode = CsharpDemo.InterfaceDef.Video_GetLastError();
                szMessage += "，错误码：" + iErrCode;
                _UpdataMessage(szMessage);
            }
        }

        private void Btn_StopPlayback_Click(object sender, EventArgs e)
        {
            if (lPlayHandle < 0)
            {
                _UpdataMessage("停止回放失败，当前没有播放");
                return;
            }

            int iRet = CsharpDemo.InterfaceDef.Video_StopPlayback(lPlayHandle);
            if (0 == iRet)
            {
                // 刷新窗口画面
                this.pictureBox_Play.Refresh();
                lPlayHandle = -1;
                string szMessage = "Video_StopPlayback return:" + iRet + "停止回放成功";
                _UpdataMessage(szMessage);
            }
            else
            {
                string szMessage = "Video_StopPlayback return:" + iRet + ", errcode:" + ", 停止回放失败";
                int iErrCode = CsharpDemo.InterfaceDef.Video_GetLastError();
                szMessage += "，错误码：" + iErrCode;
                _UpdataMessage(szMessage);
            }
        }

        private void Btn_Pause_Click(object sender, EventArgs e)
        {
            if (lPlayHandle < 0)
            {
                _UpdataMessage("暂停回放失败，当前没有播放");
                return;
            }

            int iRet = CsharpDemo.InterfaceDef.Video_PlayCtrl(lPlayHandle, 0, 0);
            string szMessage = 0 == iRet ? ("Video_PlayCtrl return:" + iRet + "暂停回放成功") : ("Video_PlayCtrl return:" + iRet + ", errcode:" + ", 暂停回放失败" + "，错误码：" + CsharpDemo.InterfaceDef.Video_GetLastError());
            _UpdataMessage(szMessage);
        }

        private void Btn_Resume_Click(object sender, EventArgs e)
        {
            if (lPlayHandle < 0)
            {
                _UpdataMessage("暂停回放失败，当前没有播放");
                return;
            }

            int iRet = CsharpDemo.InterfaceDef.Video_PlayCtrl(lPlayHandle, 1, 0);
            string szMessage = 0 == iRet ? ("Video_PlayCtrl return:" + iRet + "暂停回放成功") : ("Video_PlayCtrl return:" + iRet + ", errcode:" + ", 暂停回放失败" + "，错误码：" + CsharpDemo.InterfaceDef.Video_GetLastError());
            _UpdataMessage(szMessage);
        }

        private void Btn_SetSpeed_Click(object sender, EventArgs e)
        {
            if (lPlayHandle < 0)
            {
                _UpdataMessage("倍速回放失败，当前没有播放");
                return;
            }

            int iSpeed = Convert.ToInt32(this.comBox_Speed.SelectedItem);
            int iRet = CsharpDemo.InterfaceDef.Video_PlayCtrl(lPlayHandle, 3, iSpeed);
            string szMessage = 0 == iRet ? ("Video_PlayCtrl return:" + iRet + "，倍速回放成功") : ("，Video_PlayCtrl return:" + iRet + ", errcode:" + ", 倍速回放失败" + "，错误码：" + CsharpDemo.InterfaceDef.Video_GetLastError());
            _UpdataMessage(szMessage);
        }

        private void Btn_OpenVoice_Click(object sender, EventArgs e)
        {
            if (lPlayHandle < 0)
            {
                _UpdataMessage("打开声音失败，当前没有播放");
                return;
            }

            int iRet = CsharpDemo.InterfaceDef.Video_SoundCtrl(lPlayHandle, 0);
            string szMessage = 0 == iRet ? ("Video_SoundCtrl return:" + iRet + "，打开声音成功") : ("，Video_SoundCtrl return:" + iRet + ", errcode:" + ", 打开声音失败" + "，错误码：" + CsharpDemo.InterfaceDef.Video_GetLastError());
            _UpdataMessage(szMessage);
        }

        private void Btn_CloseVoice_Click(object sender, EventArgs e)
        {
            if (lPlayHandle < 0)
            {
                _UpdataMessage("关闭声音失败，当前没有播放");
                return;
            }

            int iRet = CsharpDemo.InterfaceDef.Video_SoundCtrl(lPlayHandle, 1);
            string szMessage = 0 == iRet ? ("Video_SoundCtrl return:" + iRet + "，关闭声音成功") : ("，Video_SoundCtrl return:" + iRet + ", errcode:" + ", 关闭声音失败" + "，错误码：" + CsharpDemo.InterfaceDef.Video_GetLastError());
            _UpdataMessage(szMessage);
        }

        private void Btn_SetVoice_Click(object sender, EventArgs e)
        {
            if (lPlayHandle < 0 || 0 == this.textBox_Voice.Text.Length)
            {
                _UpdataMessage("设置音量失败，当前没有播放或音量值为空");
                return;
            }

            int iVoice = (int)Convert.ToDouble(this.textBox_Voice.Text);
            if (iVoice < 0 || iVoice > 100)
            {
                _UpdataMessage("设置音量失败，音量值异常：" + iVoice);
                return;
            }
            int iRet = CsharpDemo.InterfaceDef.Video_SetVolume(lPlayHandle, iVoice);
            string szMessage = 0 == iRet ? ("Video_SetVolume return:" + iRet + "，设置音量成功") : ("，Video_SetVolume return:" + iRet + ", errcode:" + ", 设置音量失败" + "，错误码：" + CsharpDemo.InterfaceDef.Video_GetLastError());
            _UpdataMessage(szMessage);
        }

        private void Btn_GetVoice_Click(object sender, EventArgs e)
        {
            if (lPlayHandle < 0)
            {
                _UpdataMessage("获取音量失败，当前没有播放");
                return;
            }

            int iRet = CsharpDemo.InterfaceDef.Video_GetVolume(lPlayHandle);
            string szMessage = 0 <= iRet ? ("Video_GetVolume return:" + iRet + "，获取音量成功") : ("，Video_GetVolume return:" + iRet + ", errcode:" + ", 获取音量失败" + "，错误码：" + CsharpDemo.InterfaceDef.Video_GetLastError());
            _UpdataMessage(szMessage);
        }

        private void Btn_Snap_Click(object sender, EventArgs e)
        {
            if (lPlayHandle < 0)
            {
                _UpdataMessage("抓图失败，当前没有播放");
                return;
            }

            string szSnapFileName = this.textBox_SnapFile.Text;
            if (szSnapFileName.Length == 0)
            {
                _UpdataMessage("抓图失败，路径为空：" + szSnapFileName);
                return;
            }
            int iRet = CsharpDemo.InterfaceDef.Video_PlaySnap(lPlayHandle, szSnapFileName);
            string szMessage = 0 == iRet ? ("Video_PlaySnap return:" + iRet + "，抓图成功") : ("，Video_PlaySnap return:" + iRet + ", errcode:" + ", 抓图失败" + "，错误码：" + CsharpDemo.InterfaceDef.Video_GetLastError());
            _UpdataMessage(szMessage);

        }

        private void Btn_StartDownload_Click(object sender, EventArgs e)
        {
            if (lDownloadHandle > 0)
            {
                _UpdataMessage("下载失败，正在下载");
                return;
            }

            CsharpDemo.StructDef.stDownloadReq stDownloadReq = new StructDef.stDownloadReq()
            {
                DownloadCallBack = pfnDownloadCallBackTest,//_OnDownloadCallBack,// pfnDownloadCallBackTest,
                pUserData = IntPtr.Zero,
                lFileMaxSize = 0,
                lRecordSize = 0,
                lStartTimeStamp = 0,
                lEndTimeStamp = 0
            };
            string szDownloadUrl = this.textBox_DownloadUrl.Text;
            string szAbsoluteFile = this.textBox_DownloadFile.Text;
            //DateTime dtStartTime = this.dateTimePicker_DownloadBegin.Value;
            //DateTime dtEndTime = this.dateTimePicker_DownloadEnd.Value;
            stDownloadReq.lStartTimeStamp = DataTimeConvertTimeStamp(this.dateTimePicker_DownloadBegin.Value);
            stDownloadReq.lEndTimeStamp = DataTimeConvertTimeStamp(this.dateTimePicker_DownloadEnd.Value);
            stDownloadReq.lFileMaxSize = Convert.ToInt32(this.textBox_DownloadPackageSize.Text);
            stDownloadReq.lRecordSize = Convert.ToInt32(this.textBox_DownloadSize.Text);
            szDownloadUrl = szDownloadUrl.Trim();
            string szMessage;
            long lRet = CsharpDemo.InterfaceDef.Video_StartDownload(szDownloadUrl, szAbsoluteFile, ref stDownloadReq);
            if (lRet > 0)
            {
                lDownloadHandle = lRet;
                szMessage = "Video_StartDownload return:" + lRet + "下载成功";
            }
            else
            {
                lDownloadHandle = -1;
                szMessage = "Video_StartDownload return:" + lRet + ", errcode:" + ", 下载失败";
                int iErrCode = CsharpDemo.InterfaceDef.Video_GetLastError();
                szMessage += "，错误码：" + iErrCode;
            }
            _UpdataMessage(szMessage);
            tDownloadUpdateMessage = new System.Timers.Timer(500);
            tDownloadUpdateMessage.Elapsed += new System.Timers.ElapsedEventHandler(theout);
            tDownloadUpdateMessage.AutoReset = true;
            tDownloadUpdateMessage.Enabled = true;
            tDownloadUpdateMessage.Start();
        }

        public void theout(object source , System.Timers.ElapsedEventArgs e)
        {
            _UpdateDownloadMessage(szDownloadMessage);
        }

        private void Btn_StopDownload_Click(object sender, EventArgs e)
        {
            if (lDownloadHandle < 0)
            {
                _UpdataMessage("停止下载，当前没有下载");
                return;
            }

            int iRet = CsharpDemo.InterfaceDef.Video_StopDownload(lDownloadHandle);
            if (0 == iRet)
            {
                lDownloadHandle = -1;
                string szMessage = "Video_StopDownload return:" + iRet + "停止下载成功";
                _UpdataMessage(szMessage);
                tDownloadUpdateMessage.Elapsed -= new System.Timers.ElapsedEventHandler(theout);
                tDownloadUpdateMessage.AutoReset = false;
                tDownloadUpdateMessage.Enabled = false;
                tDownloadUpdateMessage.Stop();
                tDownloadUpdateMessage.Dispose();
            }
            else
            {
                string szMessage = "Video_StopDownload return:" + iRet + ", errcode:" + ", 停止下载失败";
                int iErrCode = CsharpDemo.InterfaceDef.Video_GetLastError();
                szMessage += "，错误码：" + iErrCode;
                _UpdataMessage(szMessage);
            }
        }
    }
}
