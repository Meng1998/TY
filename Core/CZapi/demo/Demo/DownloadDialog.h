#pragma once
#include "afxdtctl.h"
#include <thread>
#include <mutex>
#include <functional>

// CDownloadEx 对话框
#define DOWNLOAD_UPDATE_CB_INFO_TIMER_ID 0

class CDownloadDialog : public CDialog
{
	DECLARE_DYNAMIC(CDownloadDialog)

public:
	CDownloadDialog(CWnd* pParent = NULL);   // 标准构造函数
	virtual ~CDownloadDialog();

	// 本接口中实现本模块各个控件的tooltip
	void NotifyDialogInited(const char* exeFolder = nullptr);

// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_DIALOG_DOWNLOAD };
#endif

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持
	virtual void OnOK() {};
	virtual void OnCancel() {};

	DECLARE_MESSAGE_MAP()

	virtual BOOL PreTranslateMessage(MSG* pMsg);
	afx_msg LRESULT OnUpdateCallbackInfo(WPARAM wparam, LPARAM lparam);

private:
	CToolTipCtrl _toolTip;
	CListBox _msgList;
	CString _downloadFileName;
	CDateTimeCtrl _startDateCtrl;
	CDateTimeCtrl _startTimeCtrl;
	CDateTimeCtrl _endDateCtrl;
	CDateTimeCtrl _endTimeCtrl;
	LONGLONG _i64RecordSize;
	LONGLONG _i64MaxFileSize;
	CString _playbackUrl;
	CString _downLoadType;
	VIDEO_INT64 _i64DownloadHandle = -1;
	std::mutex _mutex4DLHandle;
	CString _downloadMsg;
	std::string _exefold;  // 不包含最后的“/”或“\\”的exe路径
	time_t _time4UpdateMsg = 0;
public:
	afx_msg void OnBnClickedButtonDlStart();
	afx_msg void OnBnClickedButtonDlStop();
	afx_msg void OnBnClickedButtonDlPause();
	afx_msg void OnBnClickedButtonDlResume();
	afx_msg void OnLbnDblclkListDownloadMsgbox();
private:
	void _printMsg(const std::string & func, int ret, int errorCode, ULONGLONG costs);
	void _printMsg(const std::string& msg);
	static void __stdcall cb_download(VIDEO_INT64 i64DownloadHandle, float fPercent, int iMsg, void* pUserData);
    void _showListHovScollBar();
};
