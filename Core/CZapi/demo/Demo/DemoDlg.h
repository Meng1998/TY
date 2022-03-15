
// DemoDlg.h : 头文件
//

#pragma once
#include "afxcmn.h"
#include "InitDialog.h"
#include "PreviewDialog.h"
#include "RecordPlayDialog.h"
#include "FilePlayDialog.h"
#include "DownloadDialog.h"
#include "TalkDialog.h"
#include <map>

#define DIALOG_TAB_INIT      0
#define DIALOG_TAB_PREVIEW   1
#define DIALOG_TAB_PLAYBACK  2
#define DIALOG_TAB_FILEPLAY  3
#define DIALOG_TAB_DOWNLOAD  4
#define DIALOG_TAB_TALK      5

// CDemoDlg 对话框
class CDemoDlg : public CDialog
{
// 构造
public:
	CDemoDlg(CWnd* pParent = NULL);	// 标准构造函数
	afx_msg void OnClose();

// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_DEMO_DIALOG };
#endif

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV 支持

// 实现
protected:
	HICON m_hIcon;

	// 生成的消息映射函数
	virtual BOOL OnInitDialog();
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	afx_msg void OnTabSelChange(NMHDR* pNMHDR, LRESULT* pResult);
	virtual BOOL PreTranslateMessage(MSG* pMsg);
	DECLARE_MESSAGE_MAP()

private:
	std::string GetCurrentExeFolder();
	std::string ReplaceStr(const std::string& src, const std::string& oldStr, const std::string& newStr);

private:
	CToolTipCtrl _toolTip;
	CTabCtrl _tabDialog;
	CInitDialog _initDialog;
	CPreviewDialog _previewDialog;
	CRecordPlayDialog _recordPlayDialog;
	CFilePlayDialog _filePlayDialog;
	CDownloadDialog _downloadDialog;
	CTalkDialog _talkDialog;
	std::map<int, CDialog*> _dialogMp;
};
